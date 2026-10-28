// Single, tiny serverless function: batches of anonymous UI events -> MongoDB.
// Only runs when a visitor interacts (client batches events and sends them once on page hide).
const { MongoClient } = require("mongodb");

const TYPES = new Set(["view", "search", "filter", "copy_email", "email_click", "link_click"]);
const MAX_EVENTS = 25;
const MAX_BODY = 8 * 1024;

let clientPromise; // reused across warm invocations
const getCollection = async () => {
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 3000,
    })
      .connect()
      .then(async (client) => {
        const col = client.db(process.env.MONGODB_DB || "oge").collection("events");
        // Idempotent; auto-delete raw events after ~13 months.
        await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 395 }).catch(() => {});
        return col;
      });
    clientPromise.catch(() => (clientPromise = undefined)); // allow retry after a failed connect
  }
  return clientPromise;
};

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

const readBody = (req) =>
  new Promise((resolve) => {
    if (req.body !== undefined) {
      if (typeof req.body === "string") return resolve(req.body);
      return resolve(JSON.stringify(req.body));
    }
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > MAX_BODY) req.destroy();
    });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(""));
  });

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end();
  }
  // Never break the page for analytics: always answer 204 quickly.
  const done = () => {
    res.statusCode = 204;
    res.end();
  };
  if (!process.env.MONGODB_URI) return done();

  try {
    const raw = await readBody(req);
    if (!raw || raw.length > MAX_BODY) return done();
    const body = JSON.parse(raw);
    const sid = str(body.sid, 40);
    const device = body.device === "mobile" ? "mobile" : "desktop";
    const now = new Date();

    const docs = (Array.isArray(body.events) ? body.events : [])
      .slice(0, MAX_EVENTS)
      .filter((e) => e && TYPES.has(e.type))
      .map((e) => ({
        type: e.type,
        label: str(e.label, 80),
        q: str(e.q, 60),
        results: Number.isFinite(e.results) ? Math.max(0, Math.min(99, e.results | 0)) : undefined,
        sid,
        device,
        createdAt: now,
      }));
    if (!docs.length) return done();

    await (await getCollection()).insertMany(docs, { ordered: false });
  } catch (err) {
    console.error("track failed:", err && err.message);
  }
  done();
};

// Edit this file to update teams, emails, members and quick links.
window.OGE_DATA = {
  // Member photos: name -> file in /public/team (128x128 webp/jpg). Members without a photo show initials.
  photos: {
    "Aisha": "/team/aisha.webp",
    "Islam “Sam”": "/team/sam.webp",
    "Momchil": "/team/momchil.webp",
    "Firas": "/team/firas.webp",
  },

  quickLinks: [
    {
      title: "Book your 1-1 Study Away Advising",
      subtitle: "Personal advising appointment with the Study Away team",
      options: [
        { label: "Sam", url: "https://calendar.app.google/sNoBW8q3wiKcGEVp6" },
        { label: "Momchil", url: "https://calendar.app.google/q4c5Qp2o3r1mPoJU7" },
        { label: "Aisha", url: "https://calendar.app.google/3F2HNTEkJqPqJorY6" },
        { label: "Audrey", url: "https://calendar.app.google/HTEfK6TtdjQTFmyh9" },
      ],
      icon: "calendar",
      accent: "magenta",
    },
    {
      title: "Student Mobility Office Hours",
      subtitle: "Book a slot to meet the Student Mobility team",
      copyEmail: "nyuad.studentmobility@nyu.edu",
      url: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1uLFWuJjNHGyMj7IN7pcCWvj0axNQ8LpjpuWmmmnfZBzplIISNbL0WiI4d_dg9hf0zt4xaxoxt",
      icon: "plane",
      accent: "orange",
    },
    {
      title: "Wise Independent Travel Strategies",
      subtitle: "WITS — guidance for planning independent travel",
      url: "https://students.nyuad.nyu.edu/services/student-travel/independent-student-travel/wits/",
      icon: "globe",
      accent: "teal",
    },
  ],

  topics: [
    { id: "studyaway", label: "Study Away" },
    { id: "jterm", label: "J-Term" },
    { id: "travel", label: "Travel & Tickets" },
    { id: "visa", label: "Visas & NOC" },
    { id: "internships", label: "Internships" },
    { id: "cbl", label: "Community Learning" },
    { id: "visiting", label: "Visiting Students" },
    { id: "osr", label: "Social Responsibility" },
  ],

  teams: [
    // Listed in order of relevance (most commonly needed first). Search and topic filters re-rank from here;
    // within a team, `topics` are ordered primary-first and used when a topic filter is active.
    {
      name: "Study Away Team",
      email: "nyuad.studyawaysupport@nyu.edu",
      helpsWith: [
        "Study Away",
        "J-Term applications",
        "J-Term abroad at NYU sites",
        "Summer in the US",
        "Internships during Study Away",
      ],
      members: ["Aisha", "Islam “Sam”", "Momchil", "Audrey"],
      topics: ["studyaway", "jterm", "internships"],
      accent: "magenta",
    },
    {
      name: "Student Mobility",
      email: "nyuad.studentmobility@nyu.edu",
      helpsWith: ["Home travel", "Study Away tickets", "J-Term tickets"],
      members: ["Senthil", "Salote"],
      topics: ["travel", "studyaway", "jterm"],
      accent: "orange",
    },
    {
      name: "UAE Student Visa Team",
      email: "nyuad.uaestudentvisa@nyu.edu",
      helpsWith: ["UAE student visas", "NOC requests for Fall or Spring Break (personal travel)"],
      members: ["Christine"],
      topics: ["visa", "travel"],
      accent: "teal",
    },
    {
      name: "J-Term application and enrollment",
      email: "nyuad.globaleducation@nyu.edu",
      helpsWith: ["J-Term application and enrollment"],
      members: ["Ram"],
      topics: ["jterm"],
      accent: "teal",
    },
    {
      name: "Community-Based Global Learning",
      email: "nyuad.regionalprograms@nyu.edu",
      helpsWith: ["J-Term at non-NYU sites"],
      members: ["Gloria", "Rae", "Nevin"],
      topics: ["jterm", "cbl"],
      accent: "amber",
    },
    {
      name: "Community-Based Learning (CBL)",
      email: "nyuad.cbl@nyu.edu",
      helpsWith: ["CBL activities during the semester", "Abu Dhabi-based J-Term classes"],
      members: ["Gloria", "Amna", "Laine"],
      topics: ["cbl", "jterm"],
      accent: "orange",
    },
    {
      name: "Visiting Student Program",
      email: "nyuad.visitingstudents@nyu.edu",
      helpsWith: ["Visiting student activities"],
      members: ["Farhana", "Zain", "Shinu", "Firas"],
      topics: ["visiting"],
      accent: "magenta",
    },
    {
      name: "Office of Social Responsibility",
      email: "nyuad.socialresponsiblitity@nyu.edu",
      helpsWith: ["Activities organized by the OSR"],
      members: ["Firas"],
      topics: ["osr"],
      accent: "amber",
    },
  ],
};

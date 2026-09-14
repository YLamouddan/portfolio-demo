export const projectNotes = {
  "opportunity-intelligence": {
    title: "Opportunity Intelligence",
    summary: "Turn scattered opportunities into a shortlist worth reviewing.",
    intro: "A private research pipeline built around recurring opportunity discovery. It currently gathers job opportunities from multiple sources, checks relevance against a profile, and prepares a shortlist for review.",
    steps: ["Discover", "Normalise", "Score", "Review"],
    features: [
      { title: "Multiple sources, one workflow", text: "Separate collectors bring records into a consistent format. Individual source failures are recorded without losing the rest of the run." },
      { title: "Relevant results", text: "Profile-based scoring, geography checks, and duplicate detection help narrow the research to opportunities that deserve attention." },
      { title: "Controlled execution", text: "Scheduled runs use bounded collection budgets and keep outcome records. Preparation and external actions have separate controls." },
    ],
    scope: "The research and scoring pipeline is implemented privately. No personal profiles or live results are exposed here.",
  },
  "automation-platform": {
    title: "Private Automation Platform",
    summary: "A controlled place to run the workflows a business depends on.",
    intro: "The infrastructure behind my own automation work: a privately managed environment that brings applications, AI tooling, and integrations together with controlled access and separate service networks.",
    steps: ["Access", "Workflows", "Services", "Operations"],
    features: [
      { title: "Controlled access", text: "Identity checks and private access paths keep administrative tools separate from public-facing applications." },
      { title: "Isolated services", text: "Applications and model connections run across separate networks, limiting which services can communicate with each other." },
      { title: "Repeatable operations", text: "Versioned configuration, deployment scripts, and operating notes make changes easier to trace and the environment easier to maintain." },
    ],
    scope: "This is an operating personal environment built by integrating existing tools. The public overview omits private addresses, data, and configuration.",
  },
};

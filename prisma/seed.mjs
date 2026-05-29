import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://amirkhanaidarkhan@localhost:5432/amirkhanaidarkhan",
});

const users = [
  { name: "Aiko Tanaka",      email: "atanaka@swarthmore.edu",   password: "password" },
  { name: "Marcus Chen",      email: "mchen@swarthmore.edu",     password: "password" },
  { name: "Priya Patel",      email: "ppatel@swarthmore.edu",    password: "password" },
  { name: "Jordan Rivera",    email: "jrivera@swarthmore.edu",   password: "password" },
  { name: "Lena Hoffmann",    email: "lhoffmann@swarthmore.edu", password: "password" },
  { name: "Kwame Asante",     email: "kasante@swarthmore.edu",   password: "password" },
  { name: "Sofia Rossi",      email: "srossi@swarthmore.edu",    password: "password" },
  { name: "Declan O'Brien",   email: "dobrien@swarthmore.edu",   password: "password" },
  { name: "Yuki Nakamura",    email: "ynakamura@swarthmore.edu", password: "password" },
  { name: "Zara Williams",    email: "zwilliams@swarthmore.edu", password: "password" },
];

// project ids: 2=WEB, 3=HACK, 4=INFRA, 5=DOCS, 6=DISCORD, 7=SOCIAL, 8=BOX, 9=GPU
const projectAssignments = [
  // [userIndex, projectId, role]
  [0, 2,  "lead"],   // Aiko → WEB lead
  [0, 3,  "member"], // Aiko → HACK
  [1, 3,  "lead"],   // Marcus → HACK lead
  [1, 4,  "member"], // Marcus → INFRA
  [2, 4,  "lead"],   // Priya → INFRA lead
  [2, 5,  "member"], // Priya → DOCS
  [3, 6,  "lead"],   // Jordan → DISCORD lead
  [3, 7,  "member"], // Jordan → SOCIAL
  [4, 5,  "lead"],   // Lena → DOCS lead
  [4, 9,  "member"], // Lena → GPU
  [5, 8,  "lead"],   // Kwame → BOX lead
  [5, 6,  "member"], // Kwame → DISCORD
  [6, 7,  "lead"],   // Sofia → SOCIAL lead
  [6, 2,  "member"], // Sofia → WEB
  [7, 9,  "lead"],   // Declan → GPU lead
  [7, 4,  "member"], // Declan → INFRA
  [8, 3,  "member"], // Yuki → HACK
  [8, 8,  "member"], // Yuki → BOX
  [9, 2,  "member"], // Zara → WEB
  [9, 7,  "member"], // Zara → SOCIAL
];

const newTasks = [
  // [title, description, priority, status, projectId, dueDate]
  ["Design landing page mockups",       "Create Figma wireframes for the home page",    "high",   "inprogress", 2,  "2026-06-10"],
  ["Set up CI/CD pipeline",             "Configure GitHub Actions for auto-deploy",     "high",   "todo",       4,  "2026-06-01"],
  ["Write onboarding guide",            "Draft step-by-step member onboarding doc",     "medium", "done",       5,  "2026-05-20"],
  ["Bot slash commands",                "Implement /help and /ping commands",           "medium", "shipped",    6,  "2026-05-15"],
  ["Workshop slide deck",               "Prepare slides for the intro ML workshop",     "low",    "todo",       7,  "2026-06-05"],
  ["GPU driver installation",           "Install CUDA 12 on all compute nodes",        "high",   "blocked",    9,  "2026-05-30"],
  ["Recruit boxing judges",             "Find 3 qualified judges for the match",        "medium", "todo",       8,  "2026-06-15"],
  ["Hackathon judging rubric",          "Define scoring criteria for projects",         "medium", "done",       3,  "2026-05-18"],
  ["Responsive navbar",                 "Make site nav work on mobile",                "medium", "done",       2,  "2026-05-22"],
  ["DB backup automation",              "Script nightly Postgres snapshots",           "high",   "inprogress", 4,  "2026-06-03"],
  ["Sponsor outreach emails",           "Draft and send emails to 10 potential sponsors","high", "inprogress", 8,  "2026-06-01"],
  ["Member role assignment bot command","Add /assign-role command to Discord bot",     "low",    "todo",       6,  "2026-06-08"],
  ["GPU benchmark suite",               "Run and document MLperf benchmarks",          "medium", "backlog",    9,  "2026-06-20"],
  ["Hackathon venue booking",           "Confirm Science Center rooms for 48h event",  "high",   "done",       3,  "2026-05-12"],
  ["Social media graphics",             "Design Instagram posts for workshop promo",   "low",    "done",       7,  "2026-05-19"],
];

// [taskIndex, userIndex]
const taskAssignments = [
  [0, 0], [0, 9],   // Design landing → Aiko, Zara
  [1, 1], [1, 7],   // CI/CD → Marcus, Declan
  [2, 4],           // Onboarding → Lena
  [3, 3], [3, 5],   // Bot commands → Jordan, Kwame
  [4, 6], [4, 9],   // Workshop slides → Sofia, Zara
  [5, 7], [5, 1],   // GPU drivers → Declan, Marcus
  [6, 5], [6, 8],   // Boxing judges → Kwame, Yuki
  [7, 1], [7, 8],   // Hackathon rubric → Marcus, Yuki
  [8, 0], [8, 6],   // Responsive navbar → Aiko, Sofia
  [9, 2], [9, 7],   // DB backup → Priya, Declan
  [10, 5],[10, 3],  // Sponsor emails → Kwame, Jordan
  [11, 3],          // Bot role cmd → Jordan
  [12, 7],[12, 4],  // GPU benchmarks → Declan, Lena
  [13, 1],[13, 8],  // Venue booking → Marcus, Yuki
  [14, 6],[14, 9],  // Social graphics → Sofia, Zara
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert users
    const insertedUsers = [];
    for (const u of users) {
      const res = await client.query(
        `INSERT INTO "User" (name, email, password, "createdAt")
         VALUES ($1, $2, $3, NOW() - (random() * interval '180 days'))
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [u.name, u.email, u.password]
      );
      insertedUsers.push(res.rows[0].id);
    }
    console.log("Users inserted:", insertedUsers);

    // Insert project memberships
    for (const [ui, projectId, role] of projectAssignments) {
      const userId = insertedUsers[ui];
      await client.query(
        `INSERT INTO "ProjectMember" ("userId", "projectId", role)
         VALUES ($1, $2, $3)
         ON CONFLICT ("userId", "projectId") DO NOTHING`,
        [userId, projectId, role]
      );
    }
    console.log("Project memberships done");

    // Insert tasks
    const insertedTaskIds = [];
    for (const [title, description, priority, status, projectId, dueDateStr] of newTasks) {
      const res = await client.query(
        `INSERT INTO "Task" (title, description, priority, status, "projectId", "dueDate", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW() - (random() * interval '60 days'))
         RETURNING id`,
        [title, description, priority, status, projectId, dueDateStr]
      );
      insertedTaskIds.push(res.rows[0].id);
    }
    console.log("Tasks inserted:", insertedTaskIds);

    // Assign tasks to users
    for (const [ti, ui] of taskAssignments) {
      const taskId = insertedTaskIds[ti];
      const userId = insertedUsers[ui];
      if (!taskId || !userId) continue;
      await client.query(
        `INSERT INTO "TaskAssignee" ("taskId", "userId")
         VALUES ($1, $2)
         ON CONFLICT ("taskId", "userId") DO NOTHING`,
        [taskId, userId]
      );
    }
    console.log("Task assignments done");

    await client.query("COMMIT");
    console.log("Seed complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);

// prisma/seed-sql.ts
// Generates SQL INSERT statements from the seed data
// Usage: npx ts-node prisma/seed-sql.ts > prisma/seed.sql

const users = [
  { id: "user-001", name: "สมชาย ใจดี", email: "somchai@skillshiftai.com", role: "admin", currentJobTitle: "Chief Technology Officer", department: "Technology" },
  { id: "user-002", name: "สมหญิง รักงาน", email: "somying@skillshiftai.com", role: "manager", currentJobTitle: "HR Manager", department: "Human Resources" },
  { id: "user-003", name: "วิชัย เก่งมาก", email: "wichai@skillshiftai.com", role: "employee", currentJobTitle: "Data Analyst", department: "Analytics" },
  { id: "user-004", name: "พิมพ์ใจ สดใส", email: "pimjai@skillshiftai.com", role: "employee", currentJobTitle: "Marketing Specialist", department: "Marketing" },
  { id: "user-005", name: "ธนกร ชาญฉลาด", email: "tanakorn@skillshiftai.com", role: "manager", currentJobTitle: "IT Support Lead", department: "Technology" },
];

const skills = [
  { id: "skill-001", skillName: "Python", category: "technical", description: "Python programming language" },
  { id: "skill-002", skillName: "JavaScript", category: "technical", description: "JavaScript/TypeScript development" },
  { id: "skill-003", skillName: "SQL", category: "technical", description: "Database querying and management" },
  { id: "skill-004", skillName: "Data Analysis", category: "technical", description: "Data analysis and visualization" },
  { id: "skill-005", skillName: "Machine Learning", category: "technical", description: "ML model development and deployment" },
  { id: "skill-006", skillName: "Cloud Computing", category: "technical", description: "AWS/Azure/GCP cloud services" },
  { id: "skill-007", skillName: "Communication", category: "soft", description: "Effective verbal and written communication" },
  { id: "skill-008", skillName: "Problem Solving", category: "soft", description: "Analytical and critical thinking" },
  { id: "skill-009", skillName: "Team Leadership", category: "soft", description: "Leading and motivating teams" },
  { id: "skill-010", skillName: "Time Management", category: "soft", description: "Prioritizing and managing workload" },
  { id: "skill-011", skillName: "Financial Reporting", category: "domain", description: "Financial statement preparation and analysis" },
  { id: "skill-012", skillName: "HR Compliance", category: "domain", description: "Labor law and HR regulation knowledge" },
  { id: "skill-013", skillName: "Digital Marketing", category: "domain", description: "SEO, SEM, social media marketing" },
  { id: "skill-014", skillName: "Project Management", category: "domain", description: "Agile/Waterfall project execution" },
  { id: "skill-015", skillName: "IT Service Management", category: "domain", description: "ITIL framework and incident management" },
  { id: "skill-016", skillName: "Strategic Planning", category: "management", description: "Long-term business strategy development" },
  { id: "skill-017", skillName: "Change Management", category: "management", description: "Organizational change leadership" },
  { id: "skill-018", skillName: "Budget Management", category: "management", description: "Financial planning and cost control" },
];

const jobs = [
  { id: "job-001", title: "Account Admin Officer", description: "Manages financial accounts, processes transactions, and ensures compliance with accounting standards.", department: "Finance" },
  { id: "job-002", title: "Data Analyst", description: "Collects, processes, and performs statistical analysis on large datasets to help organizations make data-driven decisions.", department: "Analytics" },
  { id: "job-003", title: "HR Officer", description: "Manages employee lifecycle including recruitment, onboarding, benefits administration, and compliance.", department: "Human Resources" },
  { id: "job-004", title: "Marketing Specialist", description: "Plans and executes marketing campaigns across digital and traditional channels to drive brand awareness and lead generation.", department: "Marketing" },
  { id: "job-005", title: "IT Support Specialist", description: "Provides technical assistance, troubleshoots hardware/software issues, and maintains IT infrastructure.", department: "Technology" },
];

const jobTasks: Record<string, Array<{ taskDescription: string; automationRiskScore: number; impactLevel: string; frequency: string; estimatedHours: number }>> = {
  "job-001": [
    { taskDescription: "Process daily accounts payable and receivable", automationRiskScore: 0.7, impactLevel: "high", frequency: "daily", estimatedHours: 4 },
    { taskDescription: "Reconcile bank statements monthly", automationRiskScore: 0.8, impactLevel: "medium", frequency: "monthly", estimatedHours: 8 },
    { taskDescription: "Prepare financial reports for management", automationRiskScore: 0.3, impactLevel: "critical", frequency: "weekly", estimatedHours: 6 },
    { taskDescription: "Handle vendor payment inquiries", automationRiskScore: 0.5, impactLevel: "low", frequency: "ad-hoc", estimatedHours: 2 },
  ],
  "job-002": [
    { taskDescription: "Clean and validate incoming datasets", automationRiskScore: 0.6, impactLevel: "medium", frequency: "daily", estimatedHours: 3 },
    { taskDescription: "Build dashboards and visualizations", automationRiskScore: 0.2, impactLevel: "high", frequency: "weekly", estimatedHours: 8 },
    { taskDescription: "Run ad-hoc queries for business stakeholders", automationRiskScore: 0.4, impactLevel: "medium", frequency: "ad-hoc", estimatedHours: 4 },
    { taskDescription: "Document data pipelines and methodology", automationRiskScore: 0.5, impactLevel: "low", frequency: "monthly", estimatedHours: 3 },
    { taskDescription: "Present findings to leadership team", automationRiskScore: 0.1, impactLevel: "critical", frequency: "weekly", estimatedHours: 2 },
  ],
  "job-003": [
    { taskDescription: "Screen resumes and schedule interviews", automationRiskScore: 0.6, impactLevel: "medium", frequency: "daily", estimatedHours: 3 },
    { taskDescription: "Process employee onboarding paperwork", automationRiskScore: 0.7, impactLevel: "high", frequency: "weekly", estimatedHours: 5 },
    { taskDescription: "Administer benefits and leave requests", automationRiskScore: 0.5, impactLevel: "medium", frequency: "daily", estimatedHours: 2 },
    { taskDescription: "Ensure compliance with labor regulations", automationRiskScore: 0.2, impactLevel: "critical", frequency: "monthly", estimatedHours: 6 },
  ],
  "job-004": [
    { taskDescription: "Create social media content calendar", automationRiskScore: 0.3, impactLevel: "medium", frequency: "weekly", estimatedHours: 6 },
    { taskDescription: "Manage paid advertising campaigns", automationRiskScore: 0.4, impactLevel: "high", frequency: "daily", estimatedHours: 3 },
    { taskDescription: "Analyze campaign performance metrics", automationRiskScore: 0.5, impactLevel: "medium", frequency: "weekly", estimatedHours: 4 },
    { taskDescription: "Coordinate with design team for collateral", automationRiskScore: 0.1, impactLevel: "low", frequency: "ad-hoc", estimatedHours: 3 },
    { taskDescription: "Conduct market research and competitor analysis", automationRiskScore: 0.3, impactLevel: "high", frequency: "monthly", estimatedHours: 8 },
  ],
  "job-005": [
    { taskDescription: "Resolve user help desk tickets", automationRiskScore: 0.4, impactLevel: "high", frequency: "daily", estimatedHours: 5 },
    { taskDescription: "Deploy and configure workstations", automationRiskScore: 0.3, impactLevel: "medium", frequency: "weekly", estimatedHours: 4 },
    { taskDescription: "Monitor system health and alerts", automationRiskScore: 0.6, impactLevel: "critical", frequency: "daily", estimatedHours: 2 },
    { taskDescription: "Maintain IT asset inventory", automationRiskScore: 0.7, impactLevel: "low", frequency: "monthly", estimatedHours: 3 },
  ],
};

const jobSkills = [
  { jobId: "job-001", skillId: "skill-003", importanceLevel: 5 },
  { jobId: "job-001", skillId: "skill-011", importanceLevel: 5 },
  { jobId: "job-001", skillId: "skill-004", importanceLevel: 4 },
  { jobId: "job-001", skillId: "skill-001", importanceLevel: 3 },
  { jobId: "job-001", skillId: "skill-010", importanceLevel: 4 },
  { jobId: "job-001", skillId: "skill-007", importanceLevel: 3 },
  { jobId: "job-002", skillId: "skill-001", importanceLevel: 5 },
  { jobId: "job-002", skillId: "skill-003", importanceLevel: 5 },
  { jobId: "job-002", skillId: "skill-004", importanceLevel: 5 },
  { jobId: "job-002", skillId: "skill-005", importanceLevel: 4 },
  { jobId: "job-002", skillId: "skill-008", importanceLevel: 4 },
  { jobId: "job-002", skillId: "skill-007", importanceLevel: 3 },
  { jobId: "job-003", skillId: "skill-012", importanceLevel: 5 },
  { jobId: "job-003", skillId: "skill-007", importanceLevel: 5 },
  { jobId: "job-003", skillId: "skill-009", importanceLevel: 4 },
  { jobId: "job-003", skillId: "skill-010", importanceLevel: 4 },
  { jobId: "job-003", skillId: "skill-014", importanceLevel: 3 },
  { jobId: "job-004", skillId: "skill-013", importanceLevel: 5 },
  { jobId: "job-004", skillId: "skill-002", importanceLevel: 4 },
  { jobId: "job-004", skillId: "skill-007", importanceLevel: 4 },
  { jobId: "job-004", skillId: "skill-004", importanceLevel: 3 },
  { jobId: "job-004", skillId: "skill-014", importanceLevel: 3 },
  { jobId: "job-004", skillId: "skill-008", importanceLevel: 3 },
  { jobId: "job-005", skillId: "skill-015", importanceLevel: 5 },
  { jobId: "job-005", skillId: "skill-006", importanceLevel: 4 },
  { jobId: "job-005", skillId: "skill-008", importanceLevel: 4 },
  { jobId: "job-005", skillId: "skill-007", importanceLevel: 3 },
  { jobId: "job-005", skillId: "skill-010", importanceLevel: 3 },
];

const userSkills = [
  { userId: "user-001", skillId: "skill-002", proficiencyLevel: 5 },
  { userId: "user-001", skillId: "skill-005", proficiencyLevel: 4 },
  { userId: "user-001", skillId: "skill-006", proficiencyLevel: 5 },
  { userId: "user-001", skillId: "skill-009", proficiencyLevel: 5 },
  { userId: "user-001", skillId: "skill-016", proficiencyLevel: 4 },
  { userId: "user-001", skillId: "skill-017", proficiencyLevel: 4 },
  { userId: "user-001", skillId: "skill-008", proficiencyLevel: 5 },
  { userId: "user-001", skillId: "skill-007", proficiencyLevel: 4 },
  { userId: "user-001", skillId: "skill-001", proficiencyLevel: 4 },
  { userId: "user-001", skillId: "skill-014", proficiencyLevel: 4 },
  { userId: "user-002", skillId: "skill-012", proficiencyLevel: 5 },
  { userId: "user-002", skillId: "skill-007", proficiencyLevel: 5 },
  { userId: "user-002", skillId: "skill-009", proficiencyLevel: 4 },
  { userId: "user-002", skillId: "skill-010", proficiencyLevel: 4 },
  { userId: "user-002", skillId: "skill-014", proficiencyLevel: 3 },
  { userId: "user-002", skillId: "skill-017", proficiencyLevel: 3 },
  { userId: "user-002", skillId: "skill-008", proficiencyLevel: 4 },
  { userId: "user-002", skillId: "skill-016", proficiencyLevel: 3 },
  { userId: "user-002", skillId: "skill-018", proficiencyLevel: 3 },
  { userId: "user-002", skillId: "skill-003", proficiencyLevel: 2 },
  { userId: "user-003", skillId: "skill-001", proficiencyLevel: 5 },
  { userId: "user-003", skillId: "skill-003", proficiencyLevel: 5 },
  { userId: "user-003", skillId: "skill-004", proficiencyLevel: 5 },
  { userId: "user-003", skillId: "skill-005", proficiencyLevel: 3 },
  { userId: "user-003", skillId: "skill-008", proficiencyLevel: 4 },
  { userId: "user-003", skillId: "skill-007", proficiencyLevel: 3 },
  { userId: "user-003", skillId: "skill-010", proficiencyLevel: 3 },
  { userId: "user-003", skillId: "skill-002", proficiencyLevel: 3 },
  { userId: "user-003", skillId: "skill-006", proficiencyLevel: 2 },
  { userId: "user-003", skillId: "skill-011", proficiencyLevel: 2 },
  { userId: "user-004", skillId: "skill-013", proficiencyLevel: 5 },
  { userId: "user-004", skillId: "skill-007", proficiencyLevel: 5 },
  { userId: "user-004", skillId: "skill-002", proficiencyLevel: 3 },
  { userId: "user-004", skillId: "skill-004", proficiencyLevel: 3 },
  { userId: "user-004", skillId: "skill-008", proficiencyLevel: 4 },
  { userId: "user-004", skillId: "skill-010", proficiencyLevel: 4 },
  { userId: "user-004", skillId: "skill-014", proficiencyLevel: 3 },
  { userId: "user-004", skillId: "skill-009", proficiencyLevel: 2 },
  { userId: "user-004", skillId: "skill-001", proficiencyLevel: 2 },
  { userId: "user-004", skillId: "skill-017", proficiencyLevel: 2 },
  { userId: "user-005", skillId: "skill-015", proficiencyLevel: 5 },
  { userId: "user-005", skillId: "skill-006", proficiencyLevel: 4 },
  { userId: "user-005", skillId: "skill-008", proficiencyLevel: 4 },
  { userId: "user-005", skillId: "skill-007", proficiencyLevel: 4 },
  { userId: "user-005", skillId: "skill-009", proficiencyLevel: 3 },
  { userId: "user-005", skillId: "skill-010", proficiencyLevel: 4 },
  { userId: "user-005", skillId: "skill-002", proficiencyLevel: 3 },
  { userId: "user-005", skillId: "skill-001", proficiencyLevel: 2 },
  { userId: "user-005", skillId: "skill-014", proficiencyLevel: 3 },
  { userId: "user-005", skillId: "skill-003", proficiencyLevel: 2 },
];

function escape(value: string): string {
  return value.replace(/'/g, "''");
}

function jsonEscape(value: object): string {
  return escape(JSON.stringify(value));
}

let sql = `-- ═══════════════════════════════════════════════════════════════
-- SkillShiftAI Seed Data (SQL)
-- Generated from prisma/seed-sql.ts
-- Run AFTER prisma db push and pgvector extension setup
-- ═══════════════════════════════════════════════════════════════

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── Users ──────────────────────────────────────────────────────
`;

for (const u of users) {
  sql += `INSERT INTO users (id, name, email, role, current_job_title, department, created_at, updated_at)\n`;
  sql += `VALUES ('${u.id}', '${escape(u.name)}', '${u.email}', '${u.role}', '${escape(u.currentJobTitle)}', '${u.department}', NOW(), NOW())\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
}

sql += `-- ─── Master Skills ─────────────────────────────────────────────\n`;

for (const s of skills) {
  sql += `INSERT INTO master_skills (id, skill_name, category, description, created_at)\n`;
  sql += `VALUES ('${s.id}', '${escape(s.skillName)}', '${s.category}', '${escape(s.description)}', NOW())\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
}

sql += `-- ─── Jobs ──────────────────────────────────────────────────────\n`;

for (const j of jobs) {
  sql += `INSERT INTO jobs (id, title, description, department, status, is_redesigned, created_at, updated_at)\n`;
  sql += `VALUES ('${j.id}', '${escape(j.title)}', '${escape(j.description)}', '${j.department}', 'active', false, NOW(), NOW())\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
}

sql += `-- ─── Job Tasks ─────────────────────────────────────────────────\n`;

let taskIdx = 1;
for (const [jobId, tasks] of Object.entries(jobTasks)) {
  for (const t of tasks) {
    sql += `INSERT INTO job_tasks (id, job_id, task_description, automation_risk_score, impact_level, frequency, estimated_hours, created_at, updated_at)\n`;
    sql += `VALUES ('task-${String(taskIdx).padStart(3, "0")}', '${jobId}', '${escape(t.taskDescription)}', ${t.automationRiskScore}, '${t.impactLevel}', '${t.frequency}', ${t.estimatedHours}, NOW(), NOW());\n\n`;
    taskIdx++;
  }
}

sql += `-- ─── Job Skills ────────────────────────────────────────────────\n`;

let jsIdx = 1;
for (const js of jobSkills) {
  sql += `INSERT INTO job_skills (id, job_id, skill_id, importance_level, created_at)\n`;
  sql += `VALUES ('js-${String(jsIdx).padStart(3, "0")}', '${js.jobId}', '${js.skillId}', ${js.importanceLevel}, NOW())\n`;
  sql += `ON CONFLICT (job_id, skill_id) DO NOTHING;\n\n`;
  jsIdx++;
}

sql += `-- ─── User Skills ───────────────────────────────────────────────\n`;

let usIdx = 1;
for (const us of userSkills) {
  sql += `INSERT INTO user_skills (id, user_id, skill_id, proficiency_level, last_assessed_at, created_at)\n`;
  sql += `VALUES ('us-${String(usIdx).padStart(3, "0")}', '${us.userId}', '${us.skillId}', ${us.proficiencyLevel}, NOW(), NOW())\n`;
  sql += `ON CONFLICT (user_id, skill_id) DO NOTHING;\n\n`;
  usIdx++;
}

sql += `-- ─── Analysis Results ──────────────────────────────────────────\n`;

const analysisResults = [
  {
    jobId: "job-001",
    analysisType: "job_analysis",
    input: { jobTitle: "Account Admin Officer", tasks: ["Process daily accounts payable/receivable", "Reconcile bank statements", "Prepare financial reports"] },
    output: { summary: "The Account Admin Officer role is heavily susceptible to automation in transactional tasks (AP/AR processing at 70% risk). Financial reporting and compliance work remain human-critical.", automationRisk: 0.58, topAutomatableTasks: ["Process daily AP/AR (70%)", "Reconcile bank statements (80%)"], reskillingRecommendations: [{ skill: "Data Analysis", priority: "high" }, { skill: "Python", priority: "medium" }, { skill: "Strategic Planning", priority: "medium" }] },
    model: "qwen3:1.7b",
    confidence: 0.82,
  },
  {
    jobId: "job-002",
    analysisType: "reskilling_recommendation",
    input: { currentSkills: ["Python", "SQL", "Data Analysis"], targetRole: "Senior Data Analyst", gaps: ["Machine Learning", "Cloud Computing", "Communication"] },
    output: { summary: "Wichai has strong foundational technical skills. Closing the ML and cloud gaps would qualify them for senior roles.", recommendedCourses: [{ skill: "Machine Learning", courseType: "online", estimatedHours: 40, priority: "high" }, { skill: "Cloud Computing", courseType: "certification", estimatedHours: 60, priority: "high" }], readinessScore: 0.65, estimatedTimeToReady: "3-4 months" },
    model: "qwen3:1.7b",
    confidence: 0.78,
  },
  {
    jobId: "job-005",
    analysisType: "automation_impact",
    input: { jobTitle: "IT Support Specialist", tasks: ["Resolve help desk tickets", "Deploy workstations", "Monitor system health", "Maintain asset inventory"] },
    output: { summary: "IT Support shows moderate automation potential. Help desk ticket triaging and system monitoring are prime candidates for AI/automation.", automationRisk: 0.50, topAutomatableTasks: ["Monitor system health (60%)", "Resolve help desk tickets (40%)", "Maintain IT asset inventory (70%)"], reskillingRecommendations: [{ skill: "Cloud Computing", priority: "high" }, { skill: "Machine Learning", priority: "medium" }] },
    model: "qwen3:1.7b",
    confidence: 0.85,
  },
];

let arIdx = 1;
for (const ar of analysisResults) {
  sql += `INSERT INTO analysis_results (id, job_id, analysis_type, input, output, model, confidence, created_at)\n`;
  sql += `VALUES ('ar-${String(arIdx).padStart(3, "0")}', '${ar.jobId}', '${ar.analysisType}', '${jsonEscape(ar.input)}'::jsonb, '${jsonEscape(ar.output)}'::jsonb, '${ar.model}', ${ar.confidence}, NOW());\n\n`;
  arIdx++;
}

sql += `-- ═══════════════════════════════════════════════════════════════\n`;
sql += `-- Seed complete! ${users.length} users, ${skills.length} skills, ${jobs.length} jobs\n`;
sql += `-- ═══════════════════════════════════════════════════════════════\n`;

process.stdout.write(sql);

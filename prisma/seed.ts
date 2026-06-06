import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD_HASH = bcrypt.hashSync("password123", 10);

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Users ────────────────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user-001",
        name: "สมชาย ใจดี",
        email: "somchai@skillshiftai.com",
        passwordHash: PASSWORD_HASH,
        role: "admin",
        currentJobTitle: "Chief Technology Officer",
        department: "Technology",
      },
    }),
    prisma.user.create({
      data: {
        id: "user-002",
        name: "สมหญิง รักงาน",
        email: "somying@skillshiftai.com",
        passwordHash: PASSWORD_HASH,
        role: "manager",
        currentJobTitle: "HR Manager",
        department: "Human Resources",
      },
    }),
    prisma.user.create({
      data: {
        id: "user-003",
        name: "วิชัย เก่งมาก",
        email: "wichai@skillshiftai.com",
        passwordHash: PASSWORD_HASH,
        role: "employee",
        currentJobTitle: "Data Analyst",
        department: "Analytics",
      },
    }),
    prisma.user.create({
      data: {
        id: "user-004",
        name: "พิมพ์ใจ สดใส",
        email: "pimjai@skillshiftai.com",
        passwordHash: PASSWORD_HASH,
        role: "employee",
        currentJobTitle: "Marketing Specialist",
        department: "Marketing",
      },
    }),
    prisma.user.create({
      data: {
        id: "user-005",
        name: "ธนกร ชาญฉลาด",
        email: "tanakorn@skillshiftai.com",
        passwordHash: PASSWORD_HASH,
        role: "manager",
        currentJobTitle: "IT Support Lead",
        department: "Technology",
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ─── Master Skills ────────────────────────────────────────────────────────
  const skills = await Promise.all([
    // Technical
    prisma.masterSkill.create({ data: { id: "skill-001", skillName: "Python", category: "technical", description: "Python programming language" } }),
    prisma.masterSkill.create({ data: { id: "skill-002", skillName: "JavaScript", category: "technical", description: "JavaScript/TypeScript development" } }),
    prisma.masterSkill.create({ data: { id: "skill-003", skillName: "SQL", category: "technical", description: "Database querying and management" } }),
    prisma.masterSkill.create({ data: { id: "skill-004", skillName: "Data Analysis", category: "technical", description: "Data analysis and visualization" } }),
    prisma.masterSkill.create({ data: { id: "skill-005", skillName: "Machine Learning", category: "technical", description: "ML model development and deployment" } }),
    prisma.masterSkill.create({ data: { id: "skill-006", skillName: "Cloud Computing", category: "technical", description: "AWS/Azure/GCP cloud services" } }),
    // Soft
    prisma.masterSkill.create({ data: { id: "skill-007", skillName: "Communication", category: "soft", description: "Effective verbal and written communication" } }),
    prisma.masterSkill.create({ data: { id: "skill-008", skillName: "Problem Solving", category: "soft", description: "Analytical and critical thinking" } }),
    prisma.masterSkill.create({ data: { id: "skill-009", skillName: "Team Leadership", category: "soft", description: "Leading and motivating teams" } }),
    prisma.masterSkill.create({ data: { id: "skill-010", skillName: "Time Management", category: "soft", description: "Prioritizing and managing workload" } }),
    // Domain
    prisma.masterSkill.create({ data: { id: "skill-011", skillName: "Financial Reporting", category: "domain", description: "Financial statement preparation and analysis" } }),
    prisma.masterSkill.create({ data: { id: "skill-012", skillName: "HR Compliance", category: "domain", description: "Labor law and HR regulation knowledge" } }),
    prisma.masterSkill.create({ data: { id: "skill-013", skillName: "Digital Marketing", category: "domain", description: "SEO, SEM, social media marketing" } }),
    prisma.masterSkill.create({ data: { id: "skill-014", skillName: "Project Management", category: "domain", description: "Agile/Waterfall project execution" } }),
    prisma.masterSkill.create({ data: { id: "skill-015", skillName: "IT Service Management", category: "domain", description: "ITIL framework and incident management" } }),
    // Management
    prisma.masterSkill.create({ data: { id: "skill-016", skillName: "Strategic Planning", category: "management", description: "Long-term business strategy development" } }),
    prisma.masterSkill.create({ data: { id: "skill-017", skillName: "Change Management", category: "management", description: "Organizational change leadership" } }),
    prisma.masterSkill.create({ data: { id: "skill-018", skillName: "Budget Management", category: "management", description: "Financial planning and cost control" } }),
  ]);
  console.log(`✅ Created ${skills.length} master skills`);

  // ─── Jobs ─────────────────────────────────────────────────────────────────
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        id: "job-001",
        title: "Account Admin Officer",
        description: "Manages financial accounts, processes transactions, and ensures compliance with accounting standards.",
        department: "Finance",
        status: "active",
        tasks: {
          create: [
            { taskDescription: "Process daily accounts payable and receivable", automationRiskScore: 0.7, impactLevel: "high", frequency: "daily", estimatedHours: 4 },
            { taskDescription: "Reconcile bank statements monthly", automationRiskScore: 0.8, impactLevel: "medium", frequency: "monthly", estimatedHours: 8 },
            { taskDescription: "Prepare financial reports for management", automationRiskScore: 0.3, impactLevel: "critical", frequency: "weekly", estimatedHours: 6 },
            { taskDescription: "Handle vendor payment inquiries", automationRiskScore: 0.5, impactLevel: "low", frequency: "ad-hoc", estimatedHours: 2 },
          ],
        },
      },
    }),
    prisma.job.create({
      data: {
        id: "job-002",
        title: "Data Analyst",
        description: "Collects, processes, and performs statistical analysis on large datasets to help organizations make data-driven decisions.",
        department: "Analytics",
        status: "active",
        tasks: {
          create: [
            { taskDescription: "Clean and validate incoming datasets", automationRiskScore: 0.6, impactLevel: "medium", frequency: "daily", estimatedHours: 3 },
            { taskDescription: "Build dashboards and visualizations", automationRiskScore: 0.2, impactLevel: "high", frequency: "weekly", estimatedHours: 8 },
            { taskDescription: "Run ad-hoc queries for business stakeholders", automationRiskScore: 0.4, impactLevel: "medium", frequency: "ad-hoc", estimatedHours: 4 },
            { taskDescription: "Document data pipelines and methodology", automationRiskScore: 0.5, impactLevel: "low", frequency: "monthly", estimatedHours: 3 },
            { taskDescription: "Present findings to leadership team", automationRiskScore: 0.1, impactLevel: "critical", frequency: "weekly", estimatedHours: 2 },
          ],
        },
      },
    }),
    prisma.job.create({
      data: {
        id: "job-003",
        title: "HR Officer",
        description: "Manages employee lifecycle including recruitment, onboarding, benefits administration, and compliance.",
        department: "Human Resources",
        status: "active",
        tasks: {
          create: [
            { taskDescription: "Screen resumes and schedule interviews", automationRiskScore: 0.6, impactLevel: "medium", frequency: "daily", estimatedHours: 3 },
            { taskDescription: "Process employee onboarding paperwork", automationRiskScore: 0.7, impactLevel: "high", frequency: "weekly", estimatedHours: 5 },
            { taskDescription: "Administer benefits and leave requests", automationRiskScore: 0.5, impactLevel: "medium", frequency: "daily", estimatedHours: 2 },
            { taskDescription: "Ensure compliance with labor regulations", automationRiskScore: 0.2, impactLevel: "critical", frequency: "monthly", estimatedHours: 6 },
          ],
        },
      },
    }),
    prisma.job.create({
      data: {
        id: "job-004",
        title: "Marketing Specialist",
        description: "Plans and executes marketing campaigns across digital and traditional channels to drive brand awareness and lead generation.",
        department: "Marketing",
        status: "active",
        tasks: {
          create: [
            { taskDescription: "Create social media content calendar", automationRiskScore: 0.3, impactLevel: "medium", frequency: "weekly", estimatedHours: 6 },
            { taskDescription: "Manage paid advertising campaigns", automationRiskScore: 0.4, impactLevel: "high", frequency: "daily", estimatedHours: 3 },
            { taskDescription: "Analyze campaign performance metrics", automationRiskScore: 0.5, impactLevel: "medium", frequency: "weekly", estimatedHours: 4 },
            { taskDescription: "Coordinate with design team for collateral", automationRiskScore: 0.1, impactLevel: "low", frequency: "ad-hoc", estimatedHours: 3 },
            { taskDescription: "Conduct market research and competitor analysis", automationRiskScore: 0.3, impactLevel: "high", frequency: "monthly", estimatedHours: 8 },
          ],
        },
      },
    }),
    prisma.job.create({
      data: {
        id: "job-005",
        title: "IT Support Specialist",
        description: "Provides technical assistance, troubleshoots hardware/software issues, and maintains IT infrastructure.",
        department: "Technology",
        status: "active",
        tasks: {
          create: [
            { taskDescription: "Resolve user help desk tickets", automationRiskScore: 0.4, impactLevel: "high", frequency: "daily", estimatedHours: 5 },
            { taskDescription: "Deploy and configure workstations", automationRiskScore: 0.3, impactLevel: "medium", frequency: "weekly", estimatedHours: 4 },
            { taskDescription: "Monitor system health and alerts", automationRiskScore: 0.6, impactLevel: "critical", frequency: "daily", estimatedHours: 2 },
            { taskDescription: "Maintain IT asset inventory", automationRiskScore: 0.7, impactLevel: "low", frequency: "monthly", estimatedHours: 3 },
          ],
        },
      },
    }),
  ]);
  console.log(`✅ Created ${jobs.length} jobs`);

  // ─── Job Skills ───────────────────────────────────────────────────────────
  const jobSkills = await Promise.all([
    // Job 1: Account Admin Officer
    prisma.jobSkill.create({ data: { jobId: "job-001", skillId: "skill-003", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-001", skillId: "skill-011", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-001", skillId: "skill-004", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-001", skillId: "skill-001", importanceLevel: 3 } }),
    prisma.jobSkill.create({ data: { jobId: "job-001", skillId: "skill-010", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-001", skillId: "skill-007", importanceLevel: 3 } }),
    // Job 2: Data Analyst
    prisma.jobSkill.create({ data: { jobId: "job-002", skillId: "skill-001", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-002", skillId: "skill-003", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-002", skillId: "skill-004", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-002", skillId: "skill-005", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-002", skillId: "skill-008", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-002", skillId: "skill-007", importanceLevel: 3 } }),
    // Job 3: HR Officer
    prisma.jobSkill.create({ data: { jobId: "job-003", skillId: "skill-012", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-003", skillId: "skill-007", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-003", skillId: "skill-009", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-003", skillId: "skill-010", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-003", skillId: "skill-014", importanceLevel: 3 } }),
    // Job 4: Marketing Specialist
    prisma.jobSkill.create({ data: { jobId: "job-004", skillId: "skill-013", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-004", skillId: "skill-002", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-004", skillId: "skill-007", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-004", skillId: "skill-004", importanceLevel: 3 } }),
    prisma.jobSkill.create({ data: { jobId: "job-004", skillId: "skill-014", importanceLevel: 3 } }),
    prisma.jobSkill.create({ data: { jobId: "job-004", skillId: "skill-008", importanceLevel: 3 } }),
    // Job 5: IT Support Specialist
    prisma.jobSkill.create({ data: { jobId: "job-005", skillId: "skill-015", importanceLevel: 5 } }),
    prisma.jobSkill.create({ data: { jobId: "job-005", skillId: "skill-006", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-005", skillId: "skill-008", importanceLevel: 4 } }),
    prisma.jobSkill.create({ data: { jobId: "job-005", skillId: "skill-007", importanceLevel: 3 } }),
    prisma.jobSkill.create({ data: { jobId: "job-005", skillId: "skill-010", importanceLevel: 3 } }),
  ]);
  console.log(`✅ Created ${jobSkills.length} job-skill relationships`);

  // ─── User Skills ──────────────────────────────────────────────────────────
  const userSkills = await Promise.all([
    // User 1: Somchai (CTO) - strong technical + management
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-002", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-005", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-006", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-009", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-016", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-017", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-008", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-007", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-001", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-001", skillId: "skill-014", proficiencyLevel: 4 } }),
    // User 2: Somying (HR Manager)
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-012", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-007", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-009", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-010", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-014", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-017", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-008", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-016", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-018", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-002", skillId: "skill-003", proficiencyLevel: 2 } }),
    // User 3: Wichai (Data Analyst)
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-001", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-003", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-004", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-005", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-008", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-007", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-010", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-002", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-006", proficiencyLevel: 2 } }),
    prisma.userSkill.create({ data: { userId: "user-003", skillId: "skill-011", proficiencyLevel: 2 } }),
    // User 4: Pimjai (Marketing Specialist)
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-013", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-007", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-002", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-004", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-008", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-010", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-014", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-009", proficiencyLevel: 2 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-001", proficiencyLevel: 2 } }),
    prisma.userSkill.create({ data: { userId: "user-004", skillId: "skill-017", proficiencyLevel: 2 } }),
    // User 5: Tanakorn (IT Support Lead)
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-015", proficiencyLevel: 5 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-006", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-008", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-007", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-009", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-010", proficiencyLevel: 4 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-002", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-001", proficiencyLevel: 2 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-014", proficiencyLevel: 3 } }),
    prisma.userSkill.create({ data: { userId: "user-005", skillId: "skill-003", proficiencyLevel: 2 } }),
  ]);
  console.log(`✅ Created ${userSkills.length} user-skill relationships`);

  // ─── Analysis Results ─────────────────────────────────────────────────────
  const analysisResults = await Promise.all([
    prisma.analysisResult.create({
      data: {
        jobId: "job-001",
        analysisType: "job_analysis",
        input: {
          jobTitle: "Account Admin Officer",
          tasks: ["Process daily accounts payable/receivable", "Reconcile bank statements", "Prepare financial reports"],
        },
        output: {
          summary: "The Account Admin Officer role is heavily susceptible to automation in transactional tasks (AP/AR processing at 70% risk). Financial reporting and compliance work remain human-critical. Recommend upskilling in data analytics and financial advisory to future-proof the role.",
          automationRisk: 0.58,
          topAutomatableTasks: ["Process daily AP/AR (70%)", "Reconcile bank statements (80%)"],
          reskillingRecommendations: [
            { skill: "Data Analysis", priority: "high", reason: "Complements financial reporting with deeper insights" },
            { skill: "Python", priority: "medium", reason: "Automate repetitive financial workflows" },
            { skill: "Strategic Planning", priority: "medium", reason: "Shift toward advisory role" },
          ],
        },
        model: "qwen3:1.7b",
        confidence: 0.82,
      },
    }),
    prisma.analysisResult.create({
      data: {
        jobId: "job-002",
        analysisType: "reskilling_recommendation",
        input: {
          currentSkills: ["Python", "SQL", "Data Analysis"],
          targetRole: "Senior Data Analyst",
          gaps: ["Machine Learning", "Cloud Computing", "Communication"],
        },
        output: {
          summary: " Wichai has strong foundational technical skills. Closing the ML and cloud gaps would qualify them for senior roles. Communication skills improvement recommended for stakeholder presentation duties.",
          recommendedCourses: [
            { skill: "Machine Learning", courseType: "online", estimatedHours: 40, priority: "high" },
            { skill: "Cloud Computing", courseType: "certification", estimatedHours: 60, priority: "high" },
            { skill: "Communication", courseType: "workshop", estimatedHours: 16, priority: "medium" },
          ],
          readinessScore: 0.65,
          estimatedTimeToReady: "3-4 months",
        },
        model: "qwen3:1.7b",
        confidence: 0.78,
      },
    }),
    prisma.analysisResult.create({
      data: {
        jobId: "job-005",
        analysisType: "automation_impact",
        input: {
          jobTitle: "IT Support Specialist",
          tasks: ["Resolve help desk tickets", "Deploy workstations", "Monitor system health", "Maintain asset inventory"],
        },
        output: {
          summary: "IT Support shows moderate automation potential. Help desk ticket triaging and system monitoring are prime candidates for AI/automation. Physical deployment tasks and complex troubleshooting remain human-dependent.",
          automationRisk: 0.50,
          topAutomatableTasks: ["Monitor system health (60%)", "Resolve help desk tickets (40%)", "Maintain IT asset inventory (70%)"],
          reskillingRecommendations: [
            { skill: "Cloud Computing", priority: "high", reason: "Shift toward cloud infrastructure management" },
            { skill: "Machine Learning", priority: "medium", reason: "Build AI-powered support tools" },
            { skill: "Strategic Planning", priority: "low", reason: "Grow into IT management" },
          ],
        },
        model: "qwen3:1.7b",
        confidence: 0.85,
      },
    }),
  ]);
  console.log(`✅ Created ${analysisResults.length} analysis results`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

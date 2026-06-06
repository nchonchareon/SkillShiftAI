import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data (order matters for foreign keys)
  await prisma.userEnrollment.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.analysisResult.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.jobTask.deleteMany();
  await prisma.job.deleteMany();
  await prisma.masterSkill.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleaned existing data");

  // ─── Users ────────────────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user-001",
        name: "สมชาย ใจดี",
        email: "somchai@skillshiftai.com",
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

  // ─── Courses ──────────────────────────────────────────────────────────────
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        id: "course-001",
        title: "Prompt Engineering for HR",
        description: "เรียนรู้การเขียน Prompt ที่มีประสิทธิภาพสำหรับงาน HR ตั้งแต่การเขียน Job Description ไปจนถึงการวิเคราะห์ผู้สมัคร",
        skillId: "skill-007",
        difficulty: "beginner",
        duration: 120,
        isPublished: true,
        modules: {
          create: [
            {
              title: "Introduction to Prompt Engineering",
              description: "Understanding what prompts are and how AI language models work",
              content: "## What is Prompt Engineering?\n\nPrompt engineering is the art of crafting instructions for AI models to get desired outputs.\n\n### Key Principles:\n1. **Be Specific**: Clearly define what you want\n2. **Provide Context**: Give background information\n3. **Set Format**: Specify output format (JSON, bullet points, etc.)\n4. **Use Examples**: Show the AI what you expect\n\n### Example Prompt:\n```\nCreate a job description for a Data Analyst position in the Marketing department. Include:\n- 5 key responsibilities\n- Required skills (technical and soft)\n- Experience level: 2-3 years\nFormat as a structured document with sections.\n```\n\nPractice this in the AI Sandbox tab!",
              aiToolType: "typhoon",
              sortOrder: 0,
              duration: 30,
            },
            {
              title: "Prompt Templates for Recruitment",
              description: "Templates for common HR tasks: screening, interviewing, evaluation",
              content: "## HR Prompt Templates\n\n### Resume Screening Prompt:\n```\nReview the following resume and score it (1-10) against these criteria:\n1. Relevant experience in [FIELD]\n2. Technical skills: [LIST]\n3. Education level\n\nResume:\n[PASTE RESUME]\n\nProvide: Score, Strengths, Weaknesses, Recommendation\n```\n\n### Interview Question Generator:\n```\nGenerate 5 behavioral interview questions for a [POSITION] role focusing on:\n- Leadership\n- Problem-solving\n- Team collaboration\n\nFor each question, include:\n- The question\n- What to look for in the answer\n- Red flags\n```\n\nPractice these templates in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 1,
              duration: 45,
            },
            {
              title: "Advanced AI for Talent Management",
              description: "Using AI for performance reviews, training plans, and succession planning",
              content: "## AI-Powered Talent Management\n\n### Performance Review Assistant:\n```\nBased on these employee achievements and goals:\n[LIST ACHIEVEMENTS]\n\nWrite a balanced performance review that:\n1. Highlights 3 key achievements\n2. Identifies 2 areas for improvement\n3. Suggests 3 development goals for next quarter\n4. Maintains a supportive, growth-oriented tone\n```\n\n### Training Needs Analysis:\n```\nAnalyze the skill gaps for a team with these current skills:\n[CURRENT SKILLS]\n\nAnd these target requirements:\n[TARGET SKILLS]\n\nCreate a prioritized 3-month training plan with:\n- Specific courses/resources\n- Expected time commitment\n- Success metrics\n```\n\nComplete this module and take the AI Tutor quiz!",
              aiToolType: "typhoon",
              sortOrder: 2,
              duration: 45,
            },
          ],
        },
      },
    }),
    prisma.course.create({
      data: {
        id: "course-002",
        title: "Data Analysis with AI",
        description: "ใช้ AI ช่วยวิเคราะห์ข้อมูล เรียนรู้การเขียน SQL Query, สร้าง Visualization, และตีความผลลัพธ์",
        skillId: "skill-004",
        difficulty: "intermediate",
        duration: 180,
        isPublished: true,
        modules: {
          create: [
            {
              title: "AI-Assisted SQL Queries",
              description: "Write and optimize SQL queries with AI help",
              content: "## Using AI for SQL\n\n### Generate SQL from Natural Language:\n```\nConvert this business question to SQL:\n\"Show me the top 10 customers by revenue last quarter\"\n\nTable schema:\n- customers (id, name, email, region)\n- orders (id, customer_id, amount, order_date)\n- order_items (id, order_id, product_id, quantity)\n\nProvide the SQL query with explanations.\n```\n\n### Query Optimization:\n```\nThis query is slow:\n[SQL QUERY]\n\nPlease suggest optimizations and explain why each change helps performance.\n```\n\nPractice in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 0,
              duration: 60,
            },
            {
              title: "Data Visualization with AI",
              description: "Generate chart configurations and interpret visualizations",
              content: "## AI for Data Visualization\n\n### Chart Recommendation:\n```\nI have this data:\n- Monthly sales for 3 product categories over 2 years\n- 36 data points total\n\nWhat chart type would best show:\n1. Trends over time?\n2. Category comparison?\n3. Seasonality patterns?\n\nProvide Python/matplotlib code for each.\n```\n\n### Insight Extraction:\n```\nHere is a summary of our Q4 data:\n[PASTE DATA SUMMARY]\n\nPlease identify:\n1. 3 key trends\n2. 2 anomalies or outliers\n3. Actionable recommendations based on the data\n```\n\nTry these prompts in the sandbox!",
              aiToolType: "typhoon",
              sortOrder: 1,
              duration: 60,
            },
            {
              title: "Statistical Analysis Assistant",
              description: "Use AI to understand and run statistical tests",
              content: "## AI for Statistics\n\n### Statistical Test Selection:\n```\nI want to compare customer satisfaction scores between:\n- Group A: Received new feature\n- Group B: Control group\n- Data type: Likert scale (1-5)\n- Sample size: 200 per group\n\nWhich statistical test should I use and why? Provide the Python code.\n```\n\n### Results Interpretation:\n```\nHere are my statistical results:\n[Test Results]\n\nPlease explain in plain English:\n1. What the results mean\n2. Practical significance (not just statistical)\n3. Limitations and caveats\n4. Next steps for analysis\n```\n\nPractice interpreting results with the AI Tutor!",
              aiToolType: "typhoon",
              sortOrder: 2,
              duration: 60,
            },
          ],
        },
      },
    }),
    prisma.course.create({
      data: {
        id: "course-003",
        title: "AI-Powered Marketing",
        description: "เรียนรู้การใช้ AI สร้าง Content, วิเคราะห์ Campaign, และจัดการ Social Media อย่างมีประสิทธิภาพ",
        skillId: "skill-013",
        difficulty: "beginner",
        duration: 150,
        isPublished: true,
        modules: {
          create: [
            {
              title: "AI Content Creation",
              description: "Generate marketing copy, blog posts, and social media content with AI",
              content: "## AI Content Marketing\n\n### Blog Post Generator:\n```\nWrite a 1000-word blog post about [TOPIC] for [AUDIENCE].\n\nInclude:\n- Compelling headline\n- Introduction with hook\n- 3 main sections with subheadings\n- Practical tips in each section\n- Call-to-action conclusion\n\nTone: Professional yet approachable\nSEO keywords: [LIST KEYWORDS]\n```\n\n### Social Media Calendar:\n```\nCreate a 1-week social media calendar for a [INDUSTRY] company.\n\nPlatforms: Facebook, Instagram, LinkedIn\nGoals: Brand awareness + lead generation\n\nInclude:\n- Post type (image, video, carousel, text)\n- Caption with hashtags\n- Best posting time\n- Engagement hook\n```\n\nCreate your first post in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 0,
              duration: 50,
            },
            {
              title: "Campaign Performance Analysis",
              description: "Use AI to analyze marketing metrics and optimize campaigns",
              content: "## AI for Campaign Analytics\n\n### Performance Report:\n```\nAnalyze these campaign metrics:\n[CAMPAIGN DATA]\n\nProvide:\n1. KPI summary (CTR, CPC, ROAS, conversion rate)\n2. What worked well vs. underperformed\n3. Audience insights\n4. Budget reallocation recommendations\n5. A/B test suggestions for next campaign\n```\n\n### Competitor Analysis:\n```\nAnalyze [COMPETITOR NAME]'s marketing strategy:\n- Their website: [URL]\n- Social media: [HANDLES]\n\nIdentify:\n1. Key messaging themes\n2. Content strategy patterns\n3. Differentiation opportunities\n4. Gaps we can exploit\n```\n\nTry analyzing a campaign in the sandbox!",
              aiToolType: "typhoon",
              sortOrder: 1,
              duration: 50,
            },
            {
              title: "Email Marketing Automation",
              description: "Craft high-converting email sequences with AI assistance",
              content: "## AI Email Marketing\n\n### Welcome Email Sequence:\n```\nCreate a 5-email welcome sequence for new subscribers to [BRAND].\n\nFor each email provide:\n- Subject line (+ A/B test variant)\n- Preview text\n- Email body (150-200 words)\n- CTA button text\n- Send timing (day + time)\n\nGoal: Convert subscribers to first purchase within 14 days.\n```\n\n### Subject Line Optimizer:\n```\nGenerate 10 subject lines for an email about [TOPIC/PRODUCT].\n\nRequirements:\n- 5 curiosity-driven\n- 3 benefit-focused\n- 2 urgency-based\n\nRate each on predicted open rate (1-10) and explain why.\n```\n\nTest your email copy in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 2,
              duration: 50,
            },
          ],
        },
      },
    }),
    prisma.course.create({
      data: {
        id: "course-004",
        title: "Cloud Computing Fundamentals",
        description: "ปูพื้นฐาน Cloud Computing ตั้งแต่ IaaS, PaaS, SaaS ไปจนถึงการ部署 แอปพลิเคชันบน Cloud",
        skillId: "skill-006",
        difficulty: "intermediate",
        duration: 200,
        isPublished: true,
        modules: {
          create: [
            {
              title: "Cloud Service Models",
              description: "Understanding IaaS, PaaS, SaaS and when to use each",
              content: "## Cloud Service Models\n\n### IaaS (Infrastructure as a Service):\n- Virtual machines, storage, networking\n- You manage: OS, runtime, apps\n- Examples: AWS EC2, Azure VMs, GCP Compute Engine\n\n### PaaS (Platform as a Service):\n- Managed platform for deploying apps\n- You manage: Application code\n- Examples: Heroku, AWS Elastic Beanstalk, Azure App Service\n\n### SaaS (Software as a Service):\n- Ready-to-use software\n- You manage: Just use it!\n- Examples: Gmail, Salesforce, Slack\n\n### Decision Framework:\n```\nI need to [TASK]. My team has [SKILL LEVEL].\nBudget: [BUDGET]\nCompliance needs: [REQUIREMENTS]\n\nRecommend the best cloud service model and specific provider/service for this use case.\nExplain your reasoning.\n```\n\nUse the AI Sandbox to explore scenarios!",
              aiToolType: "typhoon",
              sortOrder: 0,
              duration: 60,
            },
            {
              title: "Cloud Architecture Patterns",
              description: "Common patterns: microservices, serverless, containers",
              content: "## Architecture Patterns\n\n### Microservices:\n- Split app into small, independent services\n- Each service owns its data\n- Communicate via APIs or message queues\n\n### Serverless:\n- No server management\n- Pay per execution\n- Examples: AWS Lambda, Azure Functions\n\n### Containers:\n- Package app with dependencies\n- Consistent across environments\n- Docker + Kubernetes\n\n### Pattern Selection:\n```\nDescribe your application:\n- Type: [web app/API/data pipeline]\n- Expected traffic: [concurrent users]\n- Team size: [number]\n- Budget: [monthly]\n- Latency requirements: [ms]\n\nRecommend the best architecture pattern and explain:\n1. Why this pattern\n2. Key components needed\n3. Cost estimation\n4. Scaling strategy\n5. Trade-offs\n```\n\nExplore architecture options with the AI Tutor!",
              aiToolType: "typhoon",
              sortOrder: 1,
              duration: 70,
            },
            {
              title: "Cloud Cost Optimization",
              description: "Strategies to reduce cloud spending while maintaining performance",
              content: "## Cost Optimization\n\n### Key Strategies:\n1. Right-sizing instances\n2. Reserved instances / Savings Plans\n3. Spot instances for non-critical workloads\n4. Auto-scaling based on demand\n5. Storage tiering (hot/warm/cold)\n\n### Cost Analysis Prompt:\n```\nOur monthly cloud bill breakdown:\n- Compute: $X\n- Storage: $X\n- Database: $X\n- Network: $X\n- Other: $X\n\nTotal: $X/month\nUsage patterns: [DESCRIBE]\n\nAnalyze this bill and provide:\n1. Top 3 cost reduction opportunities\n2. Estimated savings for each\n3. Implementation difficulty (1-5)\n4. Risk assessment\n5. Prioritized action plan\n```\n\nAnalyze your cloud costs in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 2,
              duration: 70,
            },
          ],
        },
      },
    }),
    prisma.course.create({
      data: {
        id: "course-005",
        title: "Python for Automation",
        description: "เรียน Python สำหรับงาน Automation ตั้งแต่ Script ง่ายๆ ไปจนถึงระบบอัตโนมัติที่ซับซ้อน",
        skillId: "skill-001",
        difficulty: "beginner",
        duration: 240,
        isPublished: true,
        modules: {
          create: [
            {
              title: "Python Basics for Automation",
              description: "Variables, loops, functions - the building blocks",
              content: "## Python Fundamentals\n\n### Variables and Data Types:\n```python\nname = \"Alice\"        # string\nage = 30              # integer\nprice = 19.99         # float\nis_active = True      # boolean\nitems = [1, 2, 3]     # list\nperson = {\"name\": \"Bob\"}  # dict\n```\n\n### Control Flow:\n```python\n# If/elif/else\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"\n\n# For loop\nfor item in items:\n    print(item)\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n```\n\n### Ask AI to Write Python:\n```\nWrite a Python function that:\n1. Reads a CSV file\n2. Filters rows where [CONDITION]\n3. Calculates [METRIC]\n4. Exports to a new file\n\nInclude error handling and comments.\n```\n\nTry generating Python scripts in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 0,
              duration: 80,
            },
            {
              title: "File & Data Automation",
              description: "Automate file operations, data processing, and report generation",
              content: "## File Automation\n\n### Common Tasks:\n- Rename files in batch\n- Merge multiple CSVs\n- Generate reports from data\n- Move files based on rules\n\n### Automation Prompt:\n```\nI need to automate this daily task:\n1. Download report from [SOURCE]\n2. Extract specific columns\n3. Apply calculations\n4. Email the summary to [RECIPIENT]\n\nWrite a Python script that:\n- Runs on schedule\n- Handles errors gracefully\n- Logs activity\n- Sends notification on failure\n```\n\n### Data Processing:\n```\nI have a messy Excel file with:\n- Mixed date formats\n- Missing values\n- Duplicate entries\n- Inconsistent naming\n\nWrite a Python script to clean this data using pandas.\nInclude before/after statistics.\n```\n\nPractice automation scripts in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 1,
              duration: 80,
            },
            {
              title: "Web Scraping & API Integration",
              description: "Automate data collection from websites and APIs",
              content: "## Web Automation\n\n### Web Scraping:\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\n# Scrape product prices\ndef scrape_prices(url):\n    response = requests.get(url)\n    soup = BeautifulSoup(response.text, \"html.parser\")\n    prices = soup.find_all(\"span\", class_=\"price\")\n    return [p.text for p in prices]\n```\n\n### API Integration:\n```\nI need to integrate with [API NAME].\n\nWrite a Python script that:\n1. Authenticates with the API\n2. Fetches data from endpoint: [ENDPOINT]\n3. Handles pagination\n4. Stores results in SQLite\n5. Includes rate limiting\n6. Retries on failure\n\nAPI docs: [LINK]\n```\n\nBuild your first scraper in the AI Sandbox!",
              aiToolType: "typhoon",
              sortOrder: 2,
              duration: 80,
            },
          ],
        },
      },
    }),
  ]);
  console.log(`✅ Created ${courses.length} courses`);

  // ─── User Enrollments ─────────────────────────────────────────────────────
  const enrollments = await Promise.all([
    prisma.userEnrollment.create({ data: { userId: "user-003", courseId: "course-002", status: "IN_PROGRESS", progress: 33 } }),
    prisma.userEnrollment.create({ data: { userId: "user-004", courseId: "course-003", status: "ENROLLED", progress: 0 } }),
    prisma.userEnrollment.create({ data: { userId: "user-005", courseId: "course-004", status: "IN_PROGRESS", progress: 66 } }),
    prisma.userEnrollment.create({ data: { userId: "user-002", courseId: "course-001", status: "COMPLETED", progress: 100, completedAt: new Date() } }),
  ]);
  console.log(`✅ Created ${enrollments.length} enrollments`);

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

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const AI_PROVIDER = process.env.AI_PROVIDER || (GEMINI_API_KEY ? "gemini" : "ollama");

interface FormData {
  jobTitle: string;
  department: string;
  tasks: string;
  tools: string;
  skills: string;
}

// ── Prompts ──

function buildStructuredPrompt(formData: FormData): string {
  return `You are a job analyst. Analyze this job and assess automation risk for each task.

Job Title: ${formData.jobTitle}
Department: ${formData.department}
Tasks:
${formData.tasks}
Tools: ${formData.tools}
Skills: ${formData.skills}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "job_title": "${formData.jobTitle}",
  "department": "${formData.department}",
  "summary": "2 sentence summary of the role",
  "tasks": [
    {
      "task_description": "each task from above",
      "automation_risk_score": 0.0 to 1.0,
      "impact_level": "low or medium or high or critical",
      "frequency": "daily or weekly or monthly",
      "estimated_hours_per_week": number
    }
  ],
  "required_skills": [
    {
      "skill_name": "skill name",
      "category": "technical or soft or domain or management",
      "importance": 1 to 5
    }
  ],
  "automation_risk_average": 0.0 to 1.0,
  "redesign_recommendations": ["recommendation"]
}`;
}

function buildRawPrompt(jdText: string): string {
  return `You are a job analyst. Analyze this job description and assess automation risk.

Job Description:
${jdText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "job_title": "detected title",
  "department": "detected department",
  "summary": "2 sentence summary",
  "tasks": [
    {
      "task_description": "each task found",
      "automation_risk_score": 0.0 to 1.0,
      "impact_level": "low or medium or high or critical",
      "frequency": "daily or weekly or monthly",
      "estimated_hours_per_week": number
    }
  ],
  "required_skills": [
    {
      "skill_name": "skill name",
      "category": "technical or soft or domain or management",
      "importance": 1 to 5
    }
  ],
  "automation_risk_average": 0.0 to 1.0,
  "redesign_recommendations": ["recommendation"]
}`;
}

// ── Gemini Provider ──

async function callGemini(prompt: string): Promise<any> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI did not return valid JSON. Please try again.");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }
}

async function callGeminiFormat(prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ── Ollama Provider ──

async function callOllama(prompt: string): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 1024,
          top_k: 20,
          top_p: 0.8,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text: string = data.response || "";
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON. Please try again.");
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error("AI returned invalid JSON. Please try again.");
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("AI analysis timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callOllamaFormat(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.1, num_predict: 1024 },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text: string = data.response || "";
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

// ── Unified Interface ──

async function generateJSON(prompt: string): Promise<any> {
  if (AI_PROVIDER === "gemini") {
    return callGemini(prompt);
  }
  return callOllama(prompt);
}

async function generateText(prompt: string): Promise<string> {
  if (AI_PROVIDER === "gemini") {
    return callGeminiFormat(prompt);
  }
  return callOllamaFormat(prompt);
}

export async function analyzeJobDescription(jdText: string) {
  return generateJSON(buildRawPrompt(jdText));
}

export async function analyzeStructuredJob(formData: FormData) {
  return generateJSON(buildStructuredPrompt(formData));
}

export async function formatRawText(rawText: string): Promise<string> {
  const prompt = `Format this text into a clean Job Description with sections: Job Title, Department, Responsibilities, Tools, Required Skills.\n\nText:\n${rawText}`;
  return generateText(prompt);
}

export function getAIProvider(): string {
  return AI_PROVIDER;
}

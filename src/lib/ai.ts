const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

interface FormData {
  jobTitle: string;
  department: string;
  tasks: string;
  tools: string;
  skills: string;
}

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

export async function analyzeJobDescription(jdText: string) {
  const prompt = buildRawPrompt(jdText);
  return callOllama(prompt);
}

export async function analyzeStructuredJob(formData: FormData) {
  const prompt = buildStructuredPrompt(formData);
  return callOllama(prompt);
}

export async function formatRawText(rawText: string): Promise<string> {
  const prompt = `Format this text into a clean Job Description with sections: Job Title, Department, Responsibilities, Tools, Required Skills.\n\nText:\n${rawText}`;

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
      },
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

async function callOllama(prompt: string) {
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

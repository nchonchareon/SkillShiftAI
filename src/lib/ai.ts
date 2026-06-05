const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3:8b";

interface FormData {
  jobTitle: string;
  department: string;
  tasks: string;
  tools: string;
  skills: string;
}

function buildStructuredPrompt(formData: FormData): string {
  return `You are an expert job analyst. Analyze the following structured job information and return a JSON object with this exact structure:

{
  "job_title": "string",
  "department": "string",
  "summary": "Brief 2-sentence summary",
  "tasks": [
    {
      "task_description": "string",
      "automation_risk_score": 0.0-1.0,
      "impact_level": "low|medium|high|critical",
      "frequency": "daily|weekly|monthly|ad-hoc",
      "estimated_hours_per_week": number
    }
  ],
  "required_skills": [
    {
      "skill_name": "string",
      "category": "technical|soft|domain|management",
      "importance": 1-5
    }
  ],
  "automation_risk_average": 0.0-1.0,
  "redesign_recommendations": [
    "string"
  ]
}

Rules:
- automation_risk_score: 0.0 = safe from automation, 1.0 = fully automatable
- impact_level: based on business impact if the task is automated
- Estimate realistically based on current AI/automation capabilities
- Extract tasks from the "Tasks & Responsibilities" section, splitting multi-line text into individual tasks
- Return ONLY valid JSON, no markdown, no explanation
- /no_think

Structured Job Information:
- Job Title: ${formData.jobTitle}
- Department: ${formData.department}
- Tasks & Responsibilities:
${formData.tasks}
- Tools & Software: ${formData.tools}
- Key Skills: ${formData.skills}`;
}

function buildRawPrompt(jdText: string): string {
  return `You are an expert job analyst. Analyze the following job description and return a JSON object with this exact structure:

{
  "job_title": "string",
  "department": "string",
  "summary": "Brief 2-sentence summary",
  "tasks": [
    {
      "task_description": "string",
      "automation_risk_score": 0.0-1.0,
      "impact_level": "low|medium|high|critical",
      "frequency": "daily|weekly|monthly|ad-hoc",
      "estimated_hours_per_week": number
    }
  ],
  "required_skills": [
    {
      "skill_name": "string",
      "category": "technical|soft|domain|management",
      "importance": 1-5
    }
  ],
  "automation_risk_average": 0.0-1.0,
  "redesign_recommendations": [
    "string"
  ]
}

Rules:
- automation_risk_score: 0.0 = safe from automation, 1.0 = fully automatable
- impact_level: based on business impact if the task is automated
- Estimate realistically based on current AI/automation capabilities
- Return ONLY valid JSON, no markdown, no explanation
- /no_think

Job Description:
${jdText}`;
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
  const prompt = `You are a professional HR document formatter. Take the following raw text and format it into a clean, structured Job Description with clear sections.

Format the output as plain text with these sections:
- Job Title
- Department
- Responsibilities (numbered list)
- Tools & Software
- Required Skills

Raw text:
${rawText}

Return ONLY the formatted text, no markdown code blocks, no explanation. /no_think`;

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 2048,
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
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 4096,
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

    // Strip <think>...</think> blocks if present
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    // Try to extract JSON from the response
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
      throw new Error("AI analysis timed out. The model may be loading for the first time — please try again in 30 seconds.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

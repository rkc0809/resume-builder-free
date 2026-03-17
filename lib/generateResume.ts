import Anthropic from "@anthropic-ai/sdk";
import type { ResumeData } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are an expert ATS resume optimizer and senior technical recruiter.

Analyze the resume content and the job description, then produce a perfectly tailored ATS-optimized resume.

RULES:
1. CONTACT: Extract all personal info verbatim (name, email, phone, location, linkedin, github, portfolio).
2. SKILLS: Include ONLY skills relevant to the job description. Remove irrelevant skills. Group by category.
3. SUMMARY: 2-3 sentences packed with exact keywords from the job description.
4. EXPERIENCE: Rewrite every bullet — strong past-tense action verb + quantified impact. Mirror JD language.
5. PROJECTS: Keep only the 2-3 most relevant. Rewrite bullets to highlight what matters for this role.
6. OUTPUT: Return ONLY valid JSON. No markdown. No explanation. No preamble.

JSON schema:
{
  "name": "string",
  "title": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "portfolio": "string",
  "summary": "string",
  "skills": [{ "category": "string", "items": ["string"] }],
  "experience": [{ "title": "string", "company": "string", "location": "string", "start": "string", "end": "string", "bullets": ["string"] }],
  "projects": [{ "name": "string", "technologies": "string", "link": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "field": "string", "institution": "string", "location": "string", "year": "string", "gpa": "string", "extra": "string" }],
  "certifications": ["string"]
}`;

export async function generateResume(
  resumeText: string,
  jobDescription: string
): Promise<ResumeData> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Resume Content:

${resumeText}

Job Description:

${jobDescription}

Generate the optimized resume JSON now.`,
          },
        ],
      },
    ],
  });

  // 🔍 Extract text response safely
  const raw = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  // 🧹 Clean markdown if model accidentally adds it
  const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

  try {
    return JSON.parse(clean) as ResumeData;
  } catch (err) {
    console.error("AI RAW RESPONSE:", raw);
    throw new Error("AI returned invalid JSON. Try again.");
  }
}
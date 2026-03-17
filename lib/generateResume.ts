import Anthropic from "@anthropic-ai/sdk";
import type { ResumeData } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `You are an expert ATS resume optimizer and senior technical recruiter.

Analyze the uploaded resume PDF and the job description, then produce a perfectly tailored ATS-optimized resume.

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

export async function generateResume(pdfBase64: string, jobDescription: string): Promise<ResumeData> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{
      role: "user",
      content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
        { type: "text", text: `Job Description:\n\n${jobDescription}\n\nGenerate the optimized resume JSON now.` },
      ],
    }],
  });

  const raw = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

  try {
    return JSON.parse(clean) as ResumeData;
  } catch {
    throw new Error("AI returned invalid response. Please try again.");
  }
}

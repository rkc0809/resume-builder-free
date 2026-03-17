import { NextRequest, NextResponse } from "next/server";
import { generateResume } from "@/lib/generateResume";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("resume") as File | null;
    const jobDescription = form.get("jobDescription") as string | null;

    if (!file || !jobDescription?.trim()) {
      return NextResponse.json({ error: "Resume file and job description are required." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const resumeData = await generateResume(base64, jobDescription);

    return NextResponse.json(resumeData);
  } catch (err: unknown) {
    console.error("[/api/generate]", err);
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

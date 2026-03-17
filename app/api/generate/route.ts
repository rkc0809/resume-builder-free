import { NextRequest, NextResponse } from "next/server";
import { generateResume } from "@/lib/generateResume";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("resume") as File | null;
    const jobDescription = form.get("jobDescription") as string | null;

    // 🔒 Validation
    if (!file || !jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Resume file and job description are required." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    // 📄 Convert PDF → Text
    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any);

    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF." },
        { status: 400 }
      );
    }

    // 🤖 Generate resume using AI
    const resumeData = await generateResume(resumeText, jobDescription);

    return NextResponse.json(resumeData);
  } catch (err: unknown) {
    console.error("[/api/generate]", err);

    const message =
      err instanceof Error ? err.message : "Internal server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
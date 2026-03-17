"use client";

import { useState, useRef, useCallback } from "react";
import ResumePreview from "@/components/ResumePreview";
import type { ResumeData } from "@/lib/types";

type Step = "input" | "loading" | "result";

const LOADING_STEPS = [
  "Reading your resume...",
  "Analyzing the job description...",
  "Matching relevant skills...",
  "Filtering out irrelevant skills...",
  "Rewriting experience bullets...",
  "Tailoring your projects...",
  "Finalizing your ATS resume...",
];

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_STEPS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File too large. Max 10MB."); return; }
    setError(null);
    setResumeFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const generate = async () => {
    if (!resumeFile || !jobDesc.trim()) return;
    setError(null);
    setStep("loading");

    let i = 0;
    setLoadingMsg(LOADING_STEPS[0]);
    const interval = setInterval(() => {
      i = Math.min(i + 1, LOADING_STEPS.length - 1);
      setLoadingMsg(LOADING_STEPS[i]);
    }, 2000);

    try {
      const form = new FormData();
      form.append("resume", resumeFile);
      form.append("jobDescription", jobDesc);

      const res = await fetch("/api/generate", { method: "POST", body: form });
      clearInterval(interval);

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Generation failed. Please try again.");
      }

      const data: ResumeData = await res.json();
      setResumeData(data);
      setStep("result");
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("input");
    }
  };

  const reset = () => {
    setStep("input");
    setResumeFile(null);
    setJobDesc("");
    setResumeData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canGenerate = !!resumeFile && jobDesc.trim().length >= 20;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>

      {/* NAV */}
      <nav className="no-print" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderBottom: "0.5px solid #e5e3dc", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.5rem", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>✦ ResumeAI</span>
          <span style={{ fontSize: 12, color: "#888", background: "#E1F5EE", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>Free · No signup needed</span>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* ── HERO ── */}
        {step === "input" && (
          <div className="no-print" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 0.6rem", color: "#1a1a1a" }}>
              Tailor your resume to any job
            </h1>
            <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
              Upload your resume PDF + paste a job description. AI rewrites and optimizes it for ATS systems — then you download a clean PDF.
            </p>
          </div>
        )}

        {/* ══ INPUT ══ */}
        {step === "input" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Upload card */}
            <div style={{ background: "white", border: "0.5px solid #e5e3dc", borderRadius: 16, padding: "1.25rem" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa", marginBottom: 12 }}>
                Step 1 — Upload your resume (PDF)
              </p>
              <div
                style={{
                  border: `2px dashed ${dragging || resumeFile ? "#1D9E75" : "#ddd"}`,
                  background: resumeFile ? "#E1F5EE" : dragging ? "#f0fdf8" : "#fafaf9",
                  borderRadius: 12, padding: "2rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s",
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{resumeFile ? "✅" : "📄"}</div>
                {resumeFile ? (
                  <>
                    <p style={{ fontWeight: 600, color: "#0F6E56", margin: 0 }}>{resumeFile.name}</p>
                    <p style={{ fontSize: 12, color: "#1D9E75", marginTop: 4 }}>Click to replace</p>
                  </>
                ) : (
                  <>
                    <p style={{ color: "#555", margin: 0 }}><strong>Click to upload</strong> or drag & drop</p>
                    <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>PDF only · max 10 MB</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {/* Job description card */}
            <div style={{ background: "white", border: "0.5px solid #e5e3dc", borderRadius: 16, padding: "1.25rem" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa", marginBottom: 12 }}>
                Step 2 — Paste the job description
              </p>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={9}
                placeholder="Paste the full job description here — include all responsibilities, required skills, and qualifications. The more detail you provide, the better the tailoring..."
                style={{
                  width: "100%", background: "#fafaf9", border: "0.5px solid #e5e3dc",
                  borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#333",
                  fontFamily: "inherit", resize: "vertical", outline: "none",
                  lineHeight: 1.65, transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1D9E75")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e3dc")}
              />
              <p style={{ fontSize: 11, color: "#bbb", marginTop: 6 }}>{jobDesc.length} characters</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#FEF2F2", border: "0.5px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#B91C1C", fontSize: 14 }}>
                ⚠ {error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!canGenerate}
              style={{
                width: "100%", padding: "14px", background: canGenerate ? "#1a1a1a" : "#ccc",
                color: "white", border: "none", borderRadius: 12, fontSize: 15,
                fontWeight: 600, cursor: canGenerate ? "pointer" : "not-allowed",
                transition: "background 0.2s", fontFamily: "inherit", letterSpacing: "-0.01em",
              }}
            >
              Generate ATS-Optimized Resume →
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "#bbb" }}>
              Your resume is never stored. Processed in real-time and discarded.
            </p>
          </div>
        )}

        {/* ══ LOADING ══ */}
        {step === "loading" && (
          <div style={{ background: "white", border: "0.5px solid #e5e3dc", borderRadius: 16, padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #e5e3dc", borderTopColor: "#1D9E75", borderRadius: "50%", margin: "0 auto 1.25rem" }} className="spinner" />
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>{loadingMsg}</h3>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28 }}>Usually takes 10–20 seconds</p>
            <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, overflow: "hidden", maxWidth: 280, margin: "0 auto" }}>
              <div style={{ height: "100%", width: "35%", background: "#1D9E75", borderRadius: 2 }} className="progress-bar" />
            </div>
          </div>
        )}

        {/* ══ RESULT ══ */}
        {step === "result" && resumeData && (
          <>
            {/* Toolbar */}
            <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Your Optimized Resume</h2>
                <p style={{ fontSize: 12, color: "#888", margin: "3px 0 0" }}>Skills filtered · Keywords injected · Bullets rewritten</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={reset} style={{ padding: "8px 16px", border: "0.5px solid #ddd", borderRadius: 8, background: "white", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  ← Start over
                </button>
                <button onClick={() => window.print()} style={{ padding: "8px 18px", background: "#1D9E75", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  ⬇ Download PDF
                </button>
              </div>
            </div>

            {/* ATS badge */}
            <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 10, background: "#E1F5EE", border: "0.5px solid #5DCAA5", borderRadius: 10, padding: "10px 16px", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, color: "#0F6E56", fontSize: 13 }}>✓ ATS Ready</span>
              <span style={{ fontSize: 12, color: "#085041" }}>Irrelevant skills removed · Keywords matched · Bullets rewritten with impact</span>
            </div>

            <ResumePreview data={resumeData} />

            <p className="no-print" style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 14 }}>
              To save as PDF: click Download → in the print dialog, set Destination to <strong>"Save as PDF"</strong> and Margins to <strong>"None"</strong>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

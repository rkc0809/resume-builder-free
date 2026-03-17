import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Builder — Free AI Resume Tailoring",
  description: "Upload your resume + paste a job description. Get an ATS-optimized resume PDF instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#f8f7f4", margin: 0 }}>{children}</body>
    </html>
  );
}

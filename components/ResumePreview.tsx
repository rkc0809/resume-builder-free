import type { ResumeData } from "@/lib/types";

export default function ResumePreview({ data: r }: { data: ResumeData }) {
  const contact = [
    r.email && { label: r.email },
    r.phone && { label: r.phone },
    r.location && { label: r.location },
    r.linkedin && { label: r.linkedin },
    r.github && { label: r.github },
    r.portfolio && { label: r.portfolio },
  ].filter(Boolean) as { label: string }[];

  const S = {
    page: { background: "white", color: "#1a1a1a", fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", fontSize: "10.5pt", lineHeight: 1.55, padding: "2.5rem 2.75rem", borderRadius: "16px", border: "0.5px solid #e5e3dc", maxWidth: "820px", margin: "0 auto" } as React.CSSProperties,
    name: { fontSize: "22pt", fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 } as React.CSSProperties,
    jobTitle: { fontSize: "11pt", color: "#555", margin: "4px 0 8px", fontWeight: 400 } as React.CSSProperties,
    contactRow: { display: "flex", flexWrap: "wrap" as const, gap: "4px 18px", fontSize: "9pt", color: "#555", marginBottom: "10px" },
    hr: { border: "none", borderTop: "1.5px solid #1a1a1a", margin: "8px 0" } as React.CSSProperties,
    sectionLabel: { fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: "0 0 6px" },
    sectionWrap: { marginBottom: "12px" } as React.CSSProperties,
  };

  return (
    <div id="resume-output" style={S.page}>
      {/* Header */}
      <h1 style={S.name}>{r.name}</h1>
      {r.title && <p style={S.jobTitle}>{r.title}</p>}
      <div style={S.contactRow}>
        {contact.map((c, i) => <span key={i}>{c.label}</span>)}
      </div>
      <hr style={S.hr} />

      {/* Summary */}
      {r.summary && (
        <div style={S.sectionWrap}>
          <p style={S.sectionLabel}>Professional Summary</p>
          <p style={{ fontSize: "10pt", color: "#333", lineHeight: 1.65, margin: 0 }}>{r.summary}</p>
          <hr style={S.hr} />
        </div>
      )}

      {/* Skills */}
      {r.skills?.length > 0 && (
        <div style={S.sectionWrap}>
          <p style={S.sectionLabel}>Technical Skills</p>
          {r.skills.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: "9.5pt", marginBottom: 3 }}>
              <span style={{ fontWeight: 700, minWidth: 130, flexShrink: 0 }}>{s.category}:</span>
              <span style={{ color: "#333" }}>{s.items.join(" · ")}</span>
            </div>
          ))}
          <hr style={S.hr} />
        </div>
      )}

      {/* Experience */}
      {r.experience?.length > 0 && (
        <div style={S.sectionWrap}>
          <p style={S.sectionLabel}>Professional Experience</p>
          {r.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: i < r.experience.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: "10.5pt" }}>{e.title}</span>
                <span style={{ fontSize: "9pt", color: "#555" }}>{e.start} – {e.end}</span>
              </div>
              <p style={{ fontSize: "9.5pt", color: "#444", margin: "2px 0 4px" }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
              <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
                {e.bullets.map((b, j) => <li key={j} style={{ fontSize: "9.5pt", color: "#333", marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
          <hr style={S.hr} />
        </div>
      )}

      {/* Projects */}
      {r.projects?.length > 0 && (
        <div style={S.sectionWrap}>
          <p style={S.sectionLabel}>Projects</p>
          {r.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: i < r.projects.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: "10pt" }}>{p.name}</span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>{p.technologies}{p.link ? ` | ${p.link}` : ""}</span>
              </div>
              <ul style={{ paddingLeft: "1.1rem", margin: "3px 0 0" }}>
                {p.bullets.map((b, j) => <li key={j} style={{ fontSize: "9.5pt", color: "#333", marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
          <hr style={S.hr} />
        </div>
      )}

      {/* Education */}
      {r.education?.length > 0 && (
        <div style={S.sectionWrap}>
          <p style={S.sectionLabel}>Education</p>
          {r.education.map((e, i) => (
            <div key={i} style={{ marginBottom: i < r.education.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: "10pt" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</span>
                <span style={{ fontSize: "9pt", color: "#555" }}>{e.year}</span>
              </div>
              <p style={{ fontSize: "9.5pt", color: "#444", margin: "2px 0 0" }}>{e.institution}{e.location ? ` · ${e.location}` : ""}</p>
              {e.gpa && <p style={{ fontSize: "9pt", color: "#666", margin: "1px 0 0" }}>GPA: {e.gpa}</p>}
              {e.extra && <p style={{ fontSize: "9pt", color: "#666", margin: "1px 0 0" }}>{e.extra}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {r.certifications?.length > 0 && (
        <>
          <hr style={S.hr} />
          <div style={S.sectionWrap}>
            <p style={S.sectionLabel}>Certifications</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {r.certifications.map((c, i) => (
                <span key={i} style={{ fontSize: "9pt", border: "0.5px solid #ccc", borderRadius: 4, padding: "2px 8px", color: "#333" }}>{c}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

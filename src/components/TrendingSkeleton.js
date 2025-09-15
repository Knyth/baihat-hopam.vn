// src/components/TrendingSkeleton.js
// NEW: skeleton cho Trending (list | grid)

export default function TrendingSkeleton({ rows = 6, variant = "list" }) {
  const items = Array.from({ length: rows });

  if (variant === "grid") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {items.map((_, i) => (
          <div key={i} style={{
            background: "var(--container-color)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <div style={{ height: 16, width: "70%", background: "#e9ecef", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 14, width: "40%", background: "#e9ecef", borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  // list
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((_, i) => (
        <li key={i} style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr auto",
          alignItems: "center",
          gap: "1rem",
          padding: "0.9rem 0",
          borderBottom: "1px solid var(--border-color)"
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, border: "1px solid var(--border-color)",
            background: "#fff"
          }} />
          <div>
            <div style={{ height: 16, width: "70%", background: "#e9ecef", borderRadius: 6, marginBottom: 8 }} />
            <div style={{ height: 14, width: "40%", background: "#e9ecef", borderRadius: 6 }} />
          </div>
          <div style={{ height: 14, width: 60, background: "#e9ecef", borderRadius: 6 }} />
        </li>
      ))}
    </ol>
  );
}

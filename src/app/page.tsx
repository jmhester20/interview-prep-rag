"use client";

import { useEffect, useState } from "react";

type PrepPack = {
  id: string;
  company: string;
  role: string;
  createdAt: string;
};

export default function Home() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [packs, setPacks] = useState<PrepPack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/prep-packs");
    const data = await res.json();
    setPacks(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/prep-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role }),
      });

      if (!res.ok) {
        const msg = (await res.json())?.error ?? "Failed to create prep pack.";
        setError(msg);
        return;
      }

      setCompany("");
      setRole("");
      await load();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Interview Prep Packs</h1>

      <form onSubmit={onCreate} style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <input
          placeholder="Company (e.g., Palantir)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <input
          placeholder="Role (e.g., Software Engineer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button
          type="submit"
          disabled={isSaving}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isSaving ? "Creating..." : "Create Prep Pack"}
        </button>
      </form>

      <h2 style={{ marginTop: 32, fontSize: 18, fontWeight: 600 }}>Existing packs</h2>
      <ul style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {packs.map((p) => (
          <li key={p.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>
              {p.company} — {p.role}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Created: {new Date(p.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
        {packs.length === 0 && <li style={{ opacity: 0.7 }}>No packs yet.</li>}
      </ul>
    </main>
  );
}

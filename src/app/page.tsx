"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";


type PrepPack = {
  id: string;
  company: string;
  role: string;
  createdAt: string;
};

export default function Home() {
  const router = useRouter();
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

      const created = await res.json();

      if (!res.ok) {
        setError(created?.error ?? "Failed to create prep pack.");
        return;
      }

      setCompany("");
      setRole("");

      // send user into the new prep pack
      router.push(`/prep-packs/${created.id}/upload`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Interview Prep Packs</h1>

    

      <form onSubmit={onCreate} style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <input
          placeholder="Company (e.g., Amazon)"
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

      <ul style={{ marginTop: 12, display: "grid", gap: 10, padding: 0, listStyle: "none" }}>
        {packs.map((p) => (
          <li key={p.id}>
            <Link
              href={`/prep-packs/${p.id}/upload`}
              style={{
                display: "block",
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {p.company} — {p.role}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Created: {new Date(p.createdAt).toLocaleString()}
              </div>
            </Link>
          </li>
        ))}

        {packs.length === 0 && <li style={{ opacity: 0.7 }}>No packs yet.</li>}
      </ul>
    </main>
  );
}

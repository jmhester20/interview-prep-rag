"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DocType = "RESUME" | "JOB_POST" | "NOTES";

type DocRow = {
  id: string;
  prepPackId: string;
  type: DocType;
  filename: string | null;
  text: string;
  createdAt: string;
};

export default function UploadPage({ params }: { params: { id: string } }) {
  const prepPackId = params.id;

  const [resume, setResume] = useState("");
  const [jobPost, setJobPost] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<DocType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const charCounts = useMemo(
    () => ({
      RESUME: resume.length,
      JOB_POST: jobPost.length,
      NOTES: notes.length,
    }),
    [resume, jobPost, notes]
  );

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/prep-packs/${prepPackId}/documents`);
      const data: DocRow[] = await res.json();

      const byType = new Map<DocType, DocRow>();
      data.forEach((d) => byType.set(d.type, d));

      setResume(byType.get("RESUME")?.text ?? "");
      setJobPost(byType.get("JOB_POST")?.text ?? "");
      setNotes(byType.get("NOTES")?.text ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (type: DocType, text: string) => {
    setError(null);
    setSavedMsg(null);

    if (!text.trim()) {
      setError(`${type} cannot be empty.`);
      return;
    }

    setSaving(type);
    try {
      const res = await fetch(`/api/prep-packs/${prepPackId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Save failed.");
        return;
      }

      setSavedMsg(`Saved ${type.toLowerCase().replace("_", " ")}.`);
    } catch (e: any) {
      setError(e?.message ?? "Save failed.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Upload text</h1>
          <p className="text-sm text-muted-foreground">
            For now, paste text. File upload comes next.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/prep-packs"
            className="text-sm underline underline-offset-4 text-muted-foreground"
          >
            All packs
          </Link>
          <Link
            href={`/prep-packs/${prepPackId}/coverage`}
            className="text-sm underline underline-offset-4"
          >
            Coverage →
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="mt-6 grid gap-6">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {savedMsg && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
              {savedMsg}
            </div>
          )}

          <section className="grid gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">Resume</h2>
              <span className="text-xs text-muted-foreground">
                {charCounts.RESUME} chars
              </span>
            </div>
            <textarea
              className="min-h-[180px] w-full rounded-md border p-3 text-sm"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here"
            />
            <button
              className="w-fit rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
              onClick={() => save("RESUME", resume)}
              disabled={saving !== null}
            >
              {saving === "RESUME" ? "Saving…" : "Save resume"}
            </button>
          </section>

          <section className="grid gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">Job post</h2>
              <span className="text-xs text-muted-foreground">
                {charCounts.JOB_POST} chars
              </span>
            </div>
            <textarea
              className="min-h-[180px] w-full rounded-md border p-3 text-sm"
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              placeholder="Paste the job description here"
            />
            <button
              className="w-fit rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
              onClick={() => save("JOB_POST", jobPost)}
              disabled={saving !== null}
            >
              {saving === "JOB_POST" ? "Saving…" : "Save job post"}
            </button>
          </section>

          <section className="grid gap-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">Notes</h2>
              <span className="text-xs text-muted-foreground">
                {charCounts.NOTES} chars
              </span>
            </div>
            <textarea
              className="min-h-[140px] w-full rounded-md border p-3 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste notes (optional) like stories, achievements, keywords"
            />
            <button
              className="w-fit rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
              onClick={() => save("NOTES", notes)}
              disabled={saving !== null}
            >
              {saving === "NOTES" ? "Saving…" : "Save notes"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

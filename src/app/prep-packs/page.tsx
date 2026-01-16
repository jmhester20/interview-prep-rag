import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PrepPacksPage() {
  const packs = await prisma.prepPack.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Prep Packs</h1>
          <p className="text-sm text-muted-foreground">
            Click a pack to upload your resume, job post, and notes.
          </p>
        </div>

        <Link
          href="/"
          className="text-sm underline underline-offset-4 text-muted-foreground"
        >
          Back to create
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {packs.map((p) => (
          <Link
            key={p.id}
            href={`/prep-packs/${p.id}/upload`}
            className="rounded-lg border p-4 hover:bg-muted/50 transition"
          >
            <div className="font-medium">
              {p.company} — {p.role}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}

        {packs.length === 0 && (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            No packs yet. Create one on the home page.
          </div>
        )}
      </div>
    </main>
  );
}

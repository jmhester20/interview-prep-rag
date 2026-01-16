import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DocType = "RESUME" | "JOB_POST" | "NOTES";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const prepPackId = params.id;

  const docs = await prisma.document.findMany({
    where: { prepPackId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(docs);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const prepPackId = params.id;
  const body = await req.json();

  const type = String(body.type ?? "").toUpperCase() as DocType;
  const text = String(body.text ?? "").trim();
  const filename = body.filename ? String(body.filename) : null;

  if (!["RESUME", "JOB_POST", "NOTES"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  // Upsert-like behavior: keep only the latest doc per type per prep pack
  // (simple MVP approach so you don't pile up duplicates)
  const existing = await prisma.document.findFirst({
    where: { prepPackId, type },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const updated = await prisma.document.update({
      where: { id: existing.id },
      data: { text, filename: filename ?? undefined },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.document.create({
    data: {
      prepPackId,
      type,
      text,
      filename: filename ?? undefined,
    },
  });

  return NextResponse.json(created);
}

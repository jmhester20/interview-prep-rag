import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packs = await prisma.prepPack.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(packs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const company = String(body.company ?? "").trim();
  const role = String(body.role ?? "").trim();

  if (!company || !role) {
    return NextResponse.json(
      { error: "company and role are required" },
      { status: 400 }
    );
  }

  const pack = await prisma.prepPack.create({
    data: { company, role },
  });

  return NextResponse.json(pack);
}

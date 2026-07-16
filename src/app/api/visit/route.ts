import { NextResponse } from "next/server";
import { bumpVisits, getVisits } from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: count this visit (global, shared by everyone) and return the new total.
export async function POST() {
  try {
    const count = await bumpVisits();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("visit bump failed", err);
    return NextResponse.json({ count: null }, { status: 200 });
  }
}

// GET: read the current global total without incrementing.
export async function GET() {
  try {
    const count = await getVisits();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("visit read failed", err);
    return NextResponse.json({ count: null }, { status: 200 });
  }
}

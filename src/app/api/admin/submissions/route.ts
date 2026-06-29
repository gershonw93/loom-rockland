import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { fetchSubmissions } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  try {
    const rows = await fetchSubmissions({
      fromISO: searchParams.get("from"),
      toISO: searchParams.get("to"),
    });
    return NextResponse.json({ submissions: rows, count: rows.length });
  } catch (err) {
    console.error("list submissions failed", err);
    return NextResponse.json(
      { error: "Could not load submissions." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { fetchSubmissions, buildCsv } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fromISO = searchParams.get("from");
  const toISO = searchParams.get("to");

  try {
    const rows = await fetchSubmissions({ fromISO, toISO });
    const csv = await buildCsv(rows);

    const label = searchParams.get("label") || "all";
    const filename = `loom-rockland-enrollments-${label}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("export failed", err);
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }
}

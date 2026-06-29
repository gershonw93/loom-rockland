import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { updateSubmissionStatus } from "@/lib/submissions";
import { STATUS_VALUES } from "@/lib/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let status = "";
  try {
    const body = await req.json();
    status = typeof body?.status === "string" ? body.status : "";
  } catch {
    /* ignore */
  }
  if (!STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  try {
    await updateSubmissionStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("update status failed", err);
    return NextResponse.json({ error: "Could not update status." }, { status: 500 });
  }
}

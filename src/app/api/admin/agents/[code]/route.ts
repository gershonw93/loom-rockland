import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { deleteAgent } from "@/lib/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  // The admin password must be re-supplied to delete (two-step confirmation).
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { code } = await params;
  try {
    await deleteAgent(code);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete agent failed", err);
    return NextResponse.json({ error: "Could not delete agent." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import {
  updateSubmissionStatus,
  updateSubmissionArchived,
} from "@/lib/submissions";
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

  let body: { status?: unknown; archived?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  try {
    if (typeof body.archived === "boolean") {
      await updateSubmissionArchived(id, body.archived);
    }
    if (typeof body.status === "string") {
      if (!STATUS_VALUES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      await updateSubmissionStatus(id, body.status);
    }
    if (typeof body.archived !== "boolean" && typeof body.status !== "string") {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("update submission failed", err);
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
}

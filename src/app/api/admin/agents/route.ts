import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { fetchAgents, createAgent } from "@/lib/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const agents = await fetchAgents();
    return NextResponse.json({ agents });
  } catch (err) {
    console.error("list agents failed", err);
    return NextResponse.json({ error: "Could not load agents." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let name = "";
  try {
    const body = await req.json();
    name = typeof body?.name === "string" ? body.name.trim() : "";
  } catch {
    /* ignore */
  }
  if (!name) {
    return NextResponse.json({ error: "Agent name is required." }, { status: 400 });
  }
  try {
    const agent = await createAgent(name);
    return NextResponse.json({ agent });
  } catch (err) {
    console.error("create agent failed", err);
    return NextResponse.json({ error: "Could not create agent." }, { status: 500 });
  }
}

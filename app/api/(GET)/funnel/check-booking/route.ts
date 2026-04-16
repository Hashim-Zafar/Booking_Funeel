import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/supabaseClients/admin";
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("id, leads!inner(email)")
    .eq("leads.email", email)
    .neq("status", "canceled")
    .gt("start_time", new Date().toISOString())
    .limit(1);

  if (error) {
    return NextResponse.json(
      { error: "Failed to check booking" },
      { status: 500 }
    );
  }

  return NextResponse.json({ exists: data && data.length > 0 });
}
import { NextResponse } from "next/server";
import { leadSchema } from "@/src/lib/leadSchema";
import { supabaseAdmin } from "@/src/supabase/admin";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    //server side validation
    const parsed = leadSchema.safeParse(json);
    //!guard clause
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation Failed",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }
    const data = parsed.data;
    //handle whatsapp field
    const whatsapp =
      data.whatsapp && data.whatsapp.trim().length > 0
        ? data.whatsapp.trim()
        : null;
    //store answers as json excluding name and email
    const { name, email, ...restAnswers } = data;
    const answers = { ...restAnswers, whatsapp };
    //Single SQL operation that inserts the row as well as returns selected columns from the same row
    const { data: inserted, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name,
        email,
        answers,
        qualified: true,
      })
      .select("id, created_at,email")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const res = NextResponse.json(
      { ok: true, lead: inserted },
      { status: 201 },
    );

    //set cookies for the lead_id so that the appointments table can latter read and confirm which lead is selecting the day and time
    res.cookies.set("lead_id", inserted.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 24,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid JSON Body" }, { status: 400 });
  }
}

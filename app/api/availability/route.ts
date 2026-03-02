//! in the database date is stored as 2026-03-02 04:53:18.806461+00
//? This API endpoint will be used by the lead so timezone can differ for each lead
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date: string | null = searchParams.get("date"); // YYYY-MM-DD format
  const timeZone: string | null = searchParams.get("timezone"); //example "Asia/Karachi"

  //!guard clause
  if (!date || !timeZone) {
    return NextResponse.json(
      {
        error: "Missing necessary parameters",
      },
      { status: 400 },
    );
  }
}

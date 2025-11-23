import { supabase } from "@/src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { PostgrestError } from "@supabase/supabase-js";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await context.params;

    const { data, error, count } = await supabase
      .from("powerlifting_results")
      .select("*", { count: "exact" })
      .ilike("name", `%${name}%`);

    if (error) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      count,
    });
  } catch (e: unknown) {
    console.log(e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

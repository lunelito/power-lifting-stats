import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const paramsResolved = await context.params;
  const id = paramsResolved?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();
//     const updatedUser = await db
//       .update(users)
//       .set(body)
//       .where(eq(users.id, parseInt(params.id)))
//       .returning();
//     if (updatedUser.length === 0)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     return NextResponse.json(updatedUser[0]);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const deletedUser = await db
//       .delete(users)
//       .where(eq(users.id, parseInt(params.id)))
//       .returning();
//     if (deletedUser.length === 0)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     return NextResponse.json({ message: "User deleted successfully" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete user" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body.data;

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    console.log("Wgrano wierszy:", data.length);

    console.log(data)

    return NextResponse.json({ message: "OK", rows: data.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

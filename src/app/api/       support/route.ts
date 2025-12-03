// src/app/api/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runSupportFlow } from "@/lib/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await runSupportFlow({
      message: body.message,
      customerMetadata: body.customerMetadata,
      infoDown: body.infoDown ?? false,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Support API error:", err);
    return NextResponse.json(
      { error: "Failed to run support flow" },
      { status: 500 }
    );
  }
}


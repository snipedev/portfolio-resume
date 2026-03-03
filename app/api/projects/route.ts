import { NextResponse } from "next/server";
import { getProjectsPayload } from "@/lib/projects";

export async function GET() {
  try {
    const payload = await getProjectsPayload();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      {
        projects: [],
        meta: {
          source: "fallback",
          fetchedAt: new Date().toISOString(),
          reason: "github-fetch-failed",
        },
      },
      { status: 200 },
    );
  }
}

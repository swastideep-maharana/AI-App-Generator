import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import GeneratedApp from "@/app/models/GeneratedApp";


export async function POST(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, appType, framework, result } = await req.json();
  const userId = session.user?.email || "anonymous";

  const saved = await GeneratedApp.create({
    userId,
    prompt,
    appType,
    framework,
    result,
  });

  return NextResponse.json(saved, { status: 201 });
}

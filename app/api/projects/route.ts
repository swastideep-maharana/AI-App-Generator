import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import GeneratedApp from "@/app/models/GeneratedApp";

interface RequestBody {
  prompt: string;
  appType: string;
  framework: string;
  result: string;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { prompt, appType, framework, result } = body;

  if (!prompt || !appType || !framework || !result) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const userId = session.user?.id || session.user?.email || "anonymous";

  try {
    const saved = await GeneratedApp.create({
      userId,
      prompt,
      appType,
      framework,
      result,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to save generated app" },
      { status: 500 }
    );
  }
}

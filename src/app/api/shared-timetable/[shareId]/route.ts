import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Timetable from "@/models/timetable";

export async function GET(req: NextRequest) {
  await dbConnect();

  const shareId = req.nextUrl.pathname.split("/").pop();

  if (!shareId) {
    return NextResponse.json({ error: "Missing shareId" }, { status: 400 });
  }

  try {
    const timetable = await Timetable.findOne({ shareId });

    if (!timetable) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!timetable.isPublic) {
      return NextResponse.json({
        success: false,
        message: "Timetable is private",
        timetable: {
          title: timetable.title,
        },
      });
    }

    return NextResponse.json({
      success: true,
      timetable: {
        title: timetable.title,
        slots: timetable.slots,
        owner: timetable.owner,
        shareId: timetable.shareId,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

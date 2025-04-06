import { getAllVideos } from "@/lib/db/videos";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
  runtime: "nodejs",
};

export const GET = async () => {
  try {
    const videos = await getAllVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new NextResponse("Failed to fetch videos", { status: 500 });
  }
};

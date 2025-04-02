import {
  getMultipleUploadStatuses,
  getUploadStatus,
} from "@/lib/utils/uploadStatus";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const ids = searchParams.getAll("id");

  console.log("Received status request for IDs:", ids);

  if (!ids.length) {
    return new Response("Missing upload ID(s)", { status: 400 });
  }

  const statuses =
    ids.length === 1
      ? { [ids[0]]: await getUploadStatus(ids[0]) }
      : await getMultipleUploadStatuses(ids);

  console.log("Returning statuses:", statuses);

  return Response.json(statuses);
}

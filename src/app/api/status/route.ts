import {
  getMultipleUploadStatuses,
  getUploadStatus,
} from "@/lib/utils/uploadStatus";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const ids = searchParams.getAll("id");


  if (!ids.length) {
    return new Response("Missing upload ID(s)", { status: 400 });
  }

  const statuses =
    ids.length === 1
      ? { [ids[0]]: await getUploadStatus(ids[0]) }
      : await getMultipleUploadStatuses(ids);

  return Response.json(statuses);
}

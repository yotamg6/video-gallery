import { UploadStatus } from "@/types/video";
import axios from "axios";

interface FetchUploadStatusesProps {
  videoIds: string[];
}

export const fetchUploadStatuses = async ({
  videoIds,
}: FetchUploadStatusesProps): Promise<Record<string, UploadStatus | null>> => {
  try {
    const query = videoIds
      .map((id) => `id=${encodeURIComponent(id)}`)
      .join("&");
    const url = `/api/status?${query}`;

    console.log("Fetching upload statuses from:", url);

    const response = await axios.get(url);

    console.log("Upload statuses response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch upload statuses", error);
    return {};
  }
};

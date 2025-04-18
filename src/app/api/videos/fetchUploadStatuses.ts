import axios from "axios";

interface FetchUploadStatusesProps {
  videoIds: string[];
}

export const fetchUploadStatuses = async ({
  videoIds,
}: FetchUploadStatusesProps): Promise<Record<string, number | null>> => {
  try {
    const query = videoIds
      .map((id) => `id=${encodeURIComponent(id)}`)
      .join("&");
    const url = `/api/status?${query}`;

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch upload statuses", error);
    return {};
  }
};

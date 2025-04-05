import { checkBlobStorage, checkNeonStorage } from "@/lib/db/storageCheck";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const [blobStatus, neonStatus] = await Promise.all([
      checkBlobStorage(),
      checkNeonStorage(),
    ]);

    return NextResponse.json({
      blob: blobStatus,
      neon: neonStatus,
    });
  } catch (error) {
    console.error("Failed to calculate storage usage", error);
    return NextResponse.json(
      { status: "error", message: "Unable to retrieve storage info" },
      { status: 500 }
    );
  }
};

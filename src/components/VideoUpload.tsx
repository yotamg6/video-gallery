"use client";

import { useState } from "react";
import axios from "axios";

interface UploadResult {
  uploadId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  status?: number;
  error?: boolean;
  message?: string;
}

export default function VideoUpload() {
  const [videos, setVideos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos(files);
  };

  const handleUpload = async () => {
    if (!videos.length) return;
    setUploading(true);

    const formData = new FormData();
    videos.forEach((file) => formData.append("videos", file));

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <label className="block w-full mb-4 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-center">
        Choose Videos
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={uploading || videos.length === 0}
        className={`px-4 py-2 rounded text-white w-full transition font-medium ${
          uploading || videos.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Videos"}
      </button>

      {results.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="font-semibold">Upload Results:</h2>
          <ul className="text-sm">
            {results.map((res, idx) => (
              <li key={idx}>
                {res.error ? (
                  <span className="text-red-600">Upload failed</span>
                ) : (
                  <span className="text-green-600">
                    Uploaded:{" "}
                    <a
                      href={res.videoUrl}
                      className="underline"
                      target="_blank"
                    >
                      {res.videoUrl}
                    </a>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { UploadResult, VideoWithId } from "@/types/video";
import styles from "@/styles/uploader.module.css";

export default function VideoUpload() {
  const [videos, setVideos] = useState<VideoWithId[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFilePicker = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    if (files.length) {
      setVideos((prev) => [...prev, ...files]);
      setShowConfirmation(true);
    }
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    setUploadStarted(true);
    await handleUpload();
  };

  const handleUpload = async () => {
    if (!videos.length) return;
    setUploading(true);

    const formData = new FormData();
    videos.forEach(({ file }) => formData.append("videos", file));

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
    <div className={styles.uploadContainer}>
      <h1 className={styles.uploadTitle}>Video Uploader</h1>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={triggerFilePicker}
        disabled={uploading}
        className={`${styles.uploadBtn} ${
          uploading ? styles.uploadBtnDisabled : styles.uploadBtnActive
        }`}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!uploading && "Upload Videos"}
          {uploading && (
            <svg
              className="animate-spin h-5 w-5 text-white ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
        </span>
      </button>

      {videos.length > 0 && (
        <div className={styles.videosSection}>
          <h2 className={styles.uploadTitle}>Selected Videos:</h2>
          <ul className={styles.videoList}>
            {videos.map(({ id, file }) => (
              <li key={id} className={styles.videoItem}>
                <span>{file.name}</span>
                <span>{uploading ? "Uploading..." : "Pending"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.uploadedSection}>
          <h2 className={styles.uploadTitle}>Uploaded Videos:</h2>
          <ul>
            {results.map((res) => (
              <li key={res.fileName} className={styles.uploadedItem}>
                {res.error ? (
                  <span className={styles.uploadError}>Upload failed</span>
                ) : (
                  <span className={styles.uploadSuccess}>
                    <a
                      href={res.videoUrl}
                      className={styles.link}
                      target="_blank"
                    >
                      {res.message}
                    </a>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showConfirmation && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <h3 className={styles.confirmationHeader}>Confirm Upload</h3>
            <p className={styles.confirmationText}>
              Upload {videos.length} video(s)?
            </p>
            <div className={styles.confirmationActions}>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmUpload}
              >
                Confirm
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

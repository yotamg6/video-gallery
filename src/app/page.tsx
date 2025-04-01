import VideoUpload from "@/components/VideoUpload";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Upload Videos</h1>
      <VideoUpload />
    </main>
  );
}

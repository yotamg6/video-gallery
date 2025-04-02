import Gallery from "@/components/Gallery";
import VideoUpload from "@/components/VideoUpload";
import Image from "next/image";

const Home = () => {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      {/* <Image
        src="https://cdn.prod.website-files.com/6080285e10b3ca5844aecb46/6336ac285bf8c2b52e74102d_logo%20tolstoy.svg"
        alt="Tolstoy Logo"
        width={150}
        height={150}
      /> */}
      <Gallery />
    </main>
  );
};
export default Home;

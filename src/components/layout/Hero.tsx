import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";

export default function Hero() {
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-background-328-large.mp4"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find the Perfect Freelancer for Your Project
        </h1>
        <p className="text-xl mb-6">
          Connect with top talent worldwide on Freelancia
        </p>
        <div className="max-w-xl mx-auto flex">
          <Input
            type="text"
            placeholder="What service are you looking for?"
            className="flex-1 rounded-r-none"
          />
          <Button className="rounded-l-none">Search</Button>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Web Development", "Graphic Design", "Writing", "Marketing"].map((cat) => (
            <span
              key={cat}
              className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
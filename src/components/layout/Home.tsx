import Navbar from "./Navbar.tsx";
import About from "./About.tsx";
import Features from "./Feature.tsx";
import Gallery from "./Gallery.tsx";
import Footer from "./Footer.tsx";
import Guide from "./Guide.tsx";
import Hero from "./Hero.tsx";

export default function Home() {
    return (
        <>
         <Hero />
      <Features />
      <Gallery />
      <About />
      <Guide />
        </>
    )
}
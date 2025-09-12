import Image from "next/image";
import { Geist, Geist_Mono, Poppins, Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import HeroSection from "./components/landing/HeroSection";
import HowItWorks from "./components/landing/HowItWorks";
import WhyChooseUs from "./components/landing/WhyChooseUs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // you can load multiple weights
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
})

export default function Home() {
  return (
    <div
      className={`${geistSans.className}  ${poppins.variable} ${inter.variable}  font-sans grid grid-rows-[20px_1fr_20px] min-h-dvh`}
    >
      <main>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <WhyChooseUs />
      </main>
    </div>
  );
}

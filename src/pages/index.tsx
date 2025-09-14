import Image from "next/image";
import { Geist, Geist_Mono, Poppins, Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import HeroSection from "./components/landing/HeroSection";
import HowItWorks from "./components/landing/HowItWorks";
import WhyChooseUs from "./components/landing/WhyChooseUs";
import SeeTheDifference from "./components/landing/SeeTheDifference";
import QuickMathTest from "./components/landing/QuickMathTest";
import Testimonials from "./components/landing/Testimonials";
import BeforeAndAfter from "./components/landing/BeforeAndAfter";
import CurriculumPath from "./components/landing/CurriculumPath";
import FAQS from "./components/landing/FAQS";
import Footer from "./components/landing/Footer";
import AboutUs from "./components/landing/AboutUs";

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

import Script from "next/script";
import { useEffect } from "react";
import BookDemo from "./components/booking/BookDemo";

export default function Home() {

  return (
    <>
      {/* <Script
        src="https://app.tutorbird.com/Widget/v4/Widget.ashx?settings=eyJTY2hvb2xJRCI6InNjaF9ZOGhKRCIsIldlYnNpdGVJRCI6Indic181TmJKeCIsIldlYnNpdGVCbG9ja0lEIjoid2JiX05UN0xKcSJ9"
        strategy="afterInteractive"
      /> */}


      <div
        className={`${geistSans.className} ${poppins.variable} ${inter.variable} font-sans min-h-screen flex flex-col`}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <section>
            <HeroSection />
          </section>
          <section>
            <HowItWorks />
          </section>
          <section>
            <WhyChooseUs />
          </section>
          <section>
            <SeeTheDifference />
          </section>
          <section>
            <QuickMathTest />
          </section>
          <section>
            <Testimonials />
          </section>
          <section>
            <BeforeAndAfter />
          </section>
          <section>
            <CurriculumPath />
          </section>

          <section>
            <AboutUs />
          </section>
          <section>
            <FAQS />
          </section>
          <BookDemo />
          <section>
            <Footer />
          </section>
        </main>
      </div>
    </>
  );
}

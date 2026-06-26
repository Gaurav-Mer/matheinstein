import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Bricolage_Grotesque } from "next/font/google";

// Body — clean, highly legible workhorse.
const body = Inter({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

// Display — distinctive, modern, friendly-but-credible headlines.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--ff-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${body.variable} ${display.variable} font-sans antialiased`}>
      <Component {...pageProps} />
    </main>
  );
}

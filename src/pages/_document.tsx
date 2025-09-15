import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/matheinstein.png" />

        {/* Default Meta Tags */}
        <meta name="description" content="AI-powered math tutoring for classes 1-8 with visual learning and personalized reports." />
        <meta name="keywords" content="Math, Tutoring, AI Learning, Classes 1-8, Online Learning" />
        <meta name="author" content="Math Einstein" />

        {/* Open Graph Defaults */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Math Einstein" />
        <meta property="og:title" content="Math Einstein – Smart Learning for Classes 1 to 8" />
        <meta property="og:description" content="Personalized AI-powered math tutoring for students in grades 1-8. Learn visually, track progress, and get detailed reports." />
        <meta property="og:image" content="https://matheinstein.com//og-image.png" />
        <meta property="og:url" content="https://matheinstein.com/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Math Einstein – Smart Learning for Classes 1 to 8" />
        <meta name="twitter:description" content="Personalized AI-powered math tutoring for students in grades 1-8." />
        <meta name="twitter:image" content="https://matheinstein.com//og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

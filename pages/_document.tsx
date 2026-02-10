import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pl">
      <Head>
        <meta name="description" content="spierdal.ai — Coś nowego nadchodzi. Budujemy przyszłość z AI. Zostań z nami." />
        <meta name="theme-color" content="#09090b" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://spierdal.ai" />
        <meta property="og:title" content="spierdal.ai — Wkrótce startujemy" />
        <meta property="og:description" content="Coś nowego nadchodzi. Budujemy przyszłość z AI. Zostań z nami." />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://spierdal.ai" />
        <meta property="twitter:title" content="spierdal.ai — Wkrótce startujemy" />
        <meta property="twitter:description" content="Coś nowego nadchodzi. Budujemy przyszłość z AI. Zostań z nami." />
        <link rel="canonical" href="https://spierdal.ai" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Pixelify+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

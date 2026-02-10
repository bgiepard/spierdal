import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Head>
        <title>spierdal.ai — Wkrótce startujemy</title>
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[200px] -right-[100px] h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "var(--color-accent)", animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-[150px] -left-[100px] h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "var(--color-accent2)", animation: "float 20s ease-in-out infinite", animationDelay: "-7s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-[120px]"
          style={{ background: "var(--color-pink)", animation: "float 20s ease-in-out infinite", animationDelay: "-14s" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center p-6 text-center">
        {/* Heading */}
        <h1
          className="text-[clamp(4rem,14vw,12rem)] font-bold leading-none tracking-tight"
          style={{ fontFamily: "'Pixelify Sans', sans-serif", animation: "fadeInUp 0.8s ease-out" }}
        >
          <span className="bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent2)] to-[var(--color-pink)] bg-clip-text text-transparent">
            spierdal
          </span>
          <span
            className="ml-1 align-super text-[0.35em] font-medium text-[var(--color-text-muted)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            .ai
          </span>
        </h1>

        {/* Links */}
        <div
          className="mt-10 flex items-center gap-4"
          style={{ fontFamily: "'JetBrains Mono', monospace", animation: "fadeInUp 0.8s ease-out 0.2s both" }}
        >
          <Link
            href="/s"
            className="group relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.8rem] text-[var(--color-text)] transition-all"
            style={{
              background: "linear-gradient(var(--color-surface), var(--color-surface)) padding-box, linear-gradient(135deg, var(--color-accent), var(--color-accent2), var(--color-pink)) border-box",
              border: "1px solid transparent",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.15), 0 0 40px rgba(99, 102, 241, 0.1)",
            }}
          >
            Pisz &mdash; link się tworzy
          </Link>
          <div
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-[0.8rem] text-[var(--color-text-muted)]"
          >
            <span
              className="h-2 w-2 rounded-full bg-green-500"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            Więcej wkr&oacute;tce
          </div>
        </div>
      </div>

      <Script defer src="/_vercel/insights/script.js" />
    </>
  );
}

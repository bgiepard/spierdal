import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import pako from "pako";

// --- Token preprocessing (1-byte control chars, skip \x09 \x0A \x0D = tab/newline/CR) ---
const TOKENS: [string, string][] = [
  ["\x01", "https://www."],
  ["\x02", "https://"],
  ["\x03", "http://"],
  ["\x04", "www."],
  ["\x05", ".com/"],
  ["\x06", ".pl/"],
  ["\x07", ".com"],
  ["\x08", ".pl"],
  // skip \x09 (tab)
  // skip \x0A (newline)
  ["\x0B", ".org"],
  ["\x0C", ".net"],
  // skip \x0D (carriage return)
  ["\x0E", " będzie "],
  ["\x0F", " który "],
  ["\x10", " która "],
  ["\x11", " które "],
  ["\x12", " można "],
  ["\x13", " również "],
  ["\x14", " właśnie "],
  ["\x15", " między "],
  ["\x16", " tylko "],
  ["\x17", " może "],
  ["\x18", " więc "],
  ["\x19", " jest "],
  ["\x1A", " się "],
  ["\x1B", " już "],
  ["\x1C", " też "],
  ["\x1D", " nie "],
  ["\x1E", " że "],
  ["\x1F", " tego "],
];

function preprocess(text: string): string {
  let r = text;
  for (const [token, pattern] of TOKENS) r = r.replaceAll(pattern, token);
  return r;
}

function postprocess(text: string): string {
  let r = text;
  for (const [token, pattern] of TOKENS) r = r.replaceAll(token, pattern);
  return r;
}

// --- Polish deflate dictionary ---
import { DICTIONARY as DICT } from "@/lib/dictionary";

// --- Base64url encoding (URL-safe, no special chars) ---
function toBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// --- Compress / Decompress ---
function compress(text: string): string {
  const processed = preprocess(text);
  const bytes = new TextEncoder().encode(processed);
  const compressed = pako.deflateRaw(bytes, { level: 9, dictionary: DICT } as pako.DeflateFunctionOptions);
  return toBase64url(compressed);
}

function decompress(encoded: string): string | null {
  try {
    const compressed = fromBase64url(encoded);
    const bytes = pako.inflateRaw(compressed, { dictionary: DICT } as pako.InflateFunctionOptions);
    const text = new TextDecoder().decode(bytes);
    return postprocess(text);
  } catch {
    return null;
  }
}

export default function Shortener() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const initialized = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decompress(hash);
      if (decoded) setText(decoded);
    }
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    if (text) {
      const encoded = compress(text);
      window.history.replaceState(null, "", `#${encoded}`);
      setCurrentUrl(`${window.location.origin}/s#${encoded}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
      setCurrentUrl("");
    }
    setCopied(false);
  }, [text]);

  const copyUrl = useCallback(async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentUrl]);

  return (
    <>
      <Head>
        <title>spierdal.ai/s</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div
        className="page-s fixed inset-0 z-10 flex justify-center bg-[var(--color-bg)] overflow-auto cursor-text"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName !== "BUTTON") {
            textareaRef.current?.focus();
          }
        }}
      >
        <textarea
          ref={textareaRef}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wpisz tekst i skopiuj link..."
          className="w-full max-w-[1024px] min-h-[80vh] resize-none bg-transparent py-[10vh] px-6 text-center text-[var(--color-text)] placeholder-[var(--color-text-muted)]/40 outline-none leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(1.25rem, 3vh, 3rem)" }}
        />
      </div>

      {/* Bottom right */}
      <div className="fixed right-5 bottom-5 z-20 flex items-center gap-3">
        {currentUrl && (
          <button
            onClick={copyUrl}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs text-[var(--color-text-muted)] backdrop-blur-sm transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {copied ? "Skopiowano!" : "Kopiuj link"}
          </button>
        )}
        <Link
          href="/"
          className="text-sm font-bold opacity-40 transition-opacity hover:opacity-80"
          style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
        >
          <span className="bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent2)] to-[var(--color-pink)] bg-clip-text text-transparent">
            spierdal
          </span>
          <span className="text-[var(--color-text-muted)] text-[0.7em]">.ai</span>
        </Link>
      </div>
    </>
  );
}

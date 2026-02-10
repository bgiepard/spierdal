import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import pako from "pako";

// --- Token preprocessing (1-byte control chars) ---
const TOKENS: [string, string][] = [
  ["\x01", "https://www."],
  ["\x02", "https://"],
  ["\x03", "http://"],
  ["\x04", "www."],
  ["\x05", ".com/"],
  ["\x06", ".pl/"],
  ["\x07", ".org/"],
  ["\x08", ".net/"],
  ["\x09", ".com"],
  ["\x0A", ".pl"],
  ["\x0B", ".org"],
  ["\x0C", ".net"],
  ["\x0D", ".io"],
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
const DICT = new TextEncoder().encode(
  "https://www.http://.com.pl.org.net.io " +
  "nie się jest że do na jak ale czy to już tylko może który która które można będzie " +
  "również właśnie między więc tego wszystko wszystkich ponieważ dlatego przecież zawsze " +
  "jeszcze naprawdę dlaczego oczywiście przepraszam dziękuję proszę dobrze jestem " +
  "jednak chyba trzeba żeby przez przed bardzo często każdy swoim takie jakiś żaden nasz " +
  "kiedy teraz około pomiędzy zostać zrobić pierwszy ludzie miejsce strona praca czas " +
  "świat życie sposób część punkt koniec początek problem pytanie odpowiedź pomoc informacja " +
  "przykład sobie siebie mnie ciebie albo ani aby nawet było były dobra duże nowe inne " +
  "kilka wiele dużo mało pewnie dalej znowu nadal zaraz prawie raczej całkiem niestety"
);

// --- Base81 encoding (URL fragment safe) ---
const B81 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~!*()+=:@/?$&,;'";
const B81N = BigInt(B81.length);

function b81encode(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";
  let num = 0n;
  for (const b of bytes) num = (num << 8n) | BigInt(b);
  let result = "";
  while (num > 0n) {
    result = B81[Number(num % B81N)] + result;
    num = num / B81N;
  }
  return B81[Math.floor(bytes.length / 81)] + B81[bytes.length % 81] + result;
}

function b81decode(str: string): Uint8Array {
  if (str.length < 2) return new Uint8Array(0);
  const byteLen = B81.indexOf(str[0]) * 81 + B81.indexOf(str[1]);
  let num = 0n;
  for (let i = 2; i < str.length; i++) num = num * B81N + BigInt(B81.indexOf(str[i]));
  const bytes = new Uint8Array(byteLen);
  for (let i = byteLen - 1; i >= 0; i--) {
    bytes[i] = Number(num & 0xFFn);
    num = num >> 8n;
  }
  return bytes;
}

// --- Compress / Decompress ---
function compress(text: string): string {
  const processed = preprocess(text);
  const bytes = new TextEncoder().encode(processed);
  const compressed = pako.deflateRaw(bytes, { level: 9, dictionary: DICT });
  return b81encode(compressed);
}

function decompress(encoded: string): string | null {
  try {
    const compressed = b81decode(encoded);
    const bytes = pako.inflateRaw(compressed, { dictionary: DICT });
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

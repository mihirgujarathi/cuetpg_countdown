"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Quote {
  text: string;
  source: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EXAM_DATE = new Date("2026-03-06T09:00:00");
const QUOTE_INTERVAL_MS = 12000;
const BG_INTERVAL_MS = 2000;

// const BG_IMAGES: string[] = ["jk1.webp", "jk2.webp", "jk3.jpg", "jk4.jpg", "jk5.jpg"];
const BG_IMAGES: string[] = ["jk3.jpg", "jk4.jpg", "jk5.jpg"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTimeLeft(): TimeLeft {
  const diff = EXAM_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);

  const [bgList, setBgList] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgVisible, setBgVisible] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);

  // ── Countdown tick ──────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Load & shuffle quotes ───────────────────────────────────────────────────
  useEffect(() => {
    fetch("quotes.json")
      .then((r) => r.json())
      .then((data: Quote[]) => {
        setQuotes(shuffle(data));
        setQuoteIndex(0);
      })
      .catch(() => {
        setQuotes([
          { text: "Life goes on. 💜", source: "BTS" },
          { text: "You've got this!", source: "ARMY" },
        ]);
      });
  }, []);

  // ── Quote rotation ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (quotes.length === 0) return;
    const id = setInterval(() => {
      setQuoteFading(true);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % quotes.length);
        setQuoteFading(false);
      }, 600);
    }, QUOTE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [quotes]);

  // ── Build background list ───────────────────────────────────────────────────
  useEffect(() => {
    if (BG_IMAGES.length > 0) {
      setBgList(shuffle(BG_IMAGES.map((f) => `backgrounds/${f}`)));
    }
  }, []);

  // ── Background rotation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (bgList.length <= 1) return;
    const id = setInterval(() => {
      setBgVisible(false);
      setTimeout(() => {
        setBgIndex((i) => (i + 1) % bgList.length);
        setBgVisible(true);
      }, 800);
    }, BG_INTERVAL_MS);
    return () => clearInterval(id);
  }, [bgList]);

  // ── Audio setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onMetadata = () => setAudioReady(true);
    const onEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("ended", onEnded);
    audio.src = "audio/lofi.mp3";

    return () => {
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // ── Toggle play/pause ───────────────────────────────────────────────────────
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!hasStartedRef.current && audio.duration) {
        audio.currentTime = Math.random() * audio.duration * 0.85;
        hasStartedRef.current = true;
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  // ── Shuffle to random position ──────────────────────────────────────────────
  const shuffleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Math.random() * audio.duration * 0.85;
    hasStartedRef.current = true;
    // if already playing, keep playing from new position
    if (!isPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  // ── Particles ───────────────────────────────────────────────────────────────
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 12 + 10}s`,
    delay: `${Math.random() * 10}s`,
    color: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#d8b4fe" : "#7c3aed",
  }));

  const currentBg = bgList[bgIndex];
  const currentQuote = quotes[quoteIndex];

  return (
    <>
      {currentBg ? (
        <div
          className="bg-slide"
          style={{
            backgroundImage: `url(${currentBg})`,
            opacity: bgVisible ? 1 : 0,
          }}
        />
      ) : (
        <div className="no-bg-fallback" />
      )}

      <div className="bg-overlay" />
      <div className="bg-grain" />

      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: p.duration,
              animationDelay: p.delay,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}
      </div>

      <div className="hearts-deco">💜 💜 💜</div>

      <main className="main-container">
        <header className="site-header">
          <div className="bts-badge">Keep fighting, Prachi! ✦ I believe in you</div>
          <h1 className="site-title">
            Days until <span>CUET PG</span>
          </h1>
        </header>

        <div className="countdown-card">
          <div className="days-main">
            <div className="days-number">{timeLeft.days}</div>
            <div className="days-label">days to go</div>
          </div>

          <div className="hms-row">
            <div className="hms-unit">
              <div className="hms-number">{pad(timeLeft.hours)}</div>
              <div className="hms-label">hrs</div>
            </div>
            <div className="hms-sep">:</div>
            <div className="hms-unit">
              <div className="hms-number">{pad(timeLeft.minutes)}</div>
              <div className="hms-label">min</div>
            </div>
            <div className="hms-sep">:</div>
            <div className="hms-unit">
              <div className="hms-number">{pad(timeLeft.seconds)}</div>
              <div className="hms-label">sec</div>
            </div>
          </div>


        </div>

        {/* Quote — text only, no source/author */}
        {currentQuote && (
          <div className="quote-card">
            <p className={`quote-text ${quoteFading ? "fading" : ""}`}>
              &ldquo;{currentQuote.text}&rdquo;
            </p>
          </div>
        )}
      </main>

      {/* ── Audio controls: shuffle + play/pause ── */}
      <div className="audio-controls">
        <span className="audio-label">
          {isPlaying ? "♪ playing" : audioReady ? "music" : "loading…"}
        </span>

        {/* Shuffle button */}
        <button
          className="audio-btn"
          onClick={shuffleAudio}
          aria-label="Shuffle to random position"
          title="Jump to random spot"
          disabled={!audioReady}
          style={{ opacity: audioReady ? 1 : 0.4, cursor: audioReady ? "pointer" : "wait", fontSize: "0.95rem" }}
        >
          ⇄
        </button>

        {/* Play/pause button */}
        <button
          className="audio-btn"
          onClick={toggleAudio}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          disabled={!audioReady}
          style={{ opacity: audioReady ? 1 : 0.4, cursor: audioReady ? "pointer" : "wait" }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>
    </>
  );
}
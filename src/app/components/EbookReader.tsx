import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Menu, Moon, Sun, BookOpen, Lock, Play, Pause, Square } from "lucide-react";
import type { Book } from "../data/books";
import type { UserRole, Page } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AccessibilityWidget } from "./AccessibilityWidget";

interface EbookReaderProps {
  book: Book;
  darkMode: boolean;
  role: UserRole;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  onDarkModeToggle: () => void;
}

export function EbookReader({ book, darkMode: dm, role, onClose, onNavigate, onDarkModeToggle }: EbookReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(1); // 1 = Normal, 2 = 1.5x, 3 = 2x

  // TTS States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isGuest = role === "guest";
  const canReadFull = !isGuest;
  const previewChapters = isGuest ? Math.min(1, book.chapters.length) : book.chapters.length;
  const isLocked = isGuest && currentChapter >= previewChapters;

  const bg = highContrast ? "#000000" : (dm ? "#0D1117" : "#FAFAF8");
  const readingBg = highContrast ? "#000000" : (dm ? "#1A1A2E" : "#FFFFFF");
  const sidebar = highContrast ? "#111111" : (dm ? "#0F1623" : "#F5F7FF");
  const sidebarBorder = highContrast ? "#FFFF00" : (dm ? "#1E2D4F" : "#E5E7EB");
  const text = highContrast ? "#FFFF00" : (dm ? "#E2E8F0" : "#1A1A2A");
  const muted = dm ? "#94A3B8" : "#6B7280";
  const headerBg = highContrast ? "#111111" : (dm ? "#0F1623" : "#FFFFFF");
  const headerBorder = highContrast ? "#FFFF00" : (dm ? "#1E2D4F" : "#E5E7EB");

  const chapter = book.chapters[Math.min(currentChapter, book.chapters.length - 1)];

  const goPrevChapter = useCallback(() => {
    if (currentChapter > 0) {
      setCurrentChapter(c => c - 1);
      setCurrentPage(1);
    }
  }, [currentChapter]);

  const goNextChapter = useCallback(() => {
    if (currentChapter < book.chapters.length - 1) {
      if (isGuest && currentChapter + 1 >= previewChapters) return;
      setCurrentChapter(c => c + 1);
      setCurrentPage(1);
    }
  }, [currentChapter, book.chapters.length, isGuest, previewChapters]);

  // Handle TTS
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    return () => window.speechSynthesis.cancel();
  }, [currentChapter]);

  const toggleTTS = useCallback(() => {
    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      if (!chapter) return;
      const utterance = new SpeechSynthesisUtterance(chapter.content);
      utterance.lang = "id-ID";
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [isPlaying, isPaused, chapter]);

  const stopTTS = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight") {
        goNextChapter();
      } else if (e.key === "ArrowLeft") {
        goPrevChapter();
      } else if (e.code === "Space") {
        e.preventDefault();
        toggleTTS();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNextChapter, goPrevChapter, toggleTTS]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: bg, fontFamily: dyslexiaFont ? "'OpenDyslexic', sans-serif" : "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      {/* Header Bar */}
      <header
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ backgroundColor: headerBg, borderBottom: `1px solid ${headerBorder}`, height: "56px" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: muted }}
            aria-label="Toggle daftar isi"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div
              className="w-7 h-7 rounded overflow-hidden flex-shrink-0"
            >
              <ImageWithFallback src={book.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: text, lineHeight: 1.2 }}>
                {book.title}
              </div>
              <div style={{ fontSize: "0.7rem", color: muted }}>
                {book.author}
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", fontWeight: 500, color: muted }}>
          {chapter?.title}
        </div>

        <div className="flex items-center gap-2">
          {isGuest && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "0.75rem", fontWeight: 500 }}
            >
              <Lock className="w-3.5 h-3.5" />
              Mode Preview
            </div>
          )}
          <button
            onClick={onDarkModeToggle}
            className="p-2 rounded-lg transition-colors"
            style={{ color: muted }}
            aria-label={dm ? "Mode terang" : "Mode gelap"}
          >
            {dm ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: muted }}
            aria-label="Tutup pembaca"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar TOC */}
        {sidebarOpen && (
          <aside
            className="w-64 flex-shrink-0 flex flex-col overflow-y-auto"
            style={{ backgroundColor: sidebar, borderRight: `1px solid ${sidebarBorder}` }}
            aria-label="Daftar isi"
          >
            <div className="p-4">
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Daftar Isi
              </div>
              <div className="flex flex-col gap-1">
                {book.chapters.map((ch, i) => {
                  const locked = isGuest && i >= previewChapters;
                  return (
                    <button
                      key={i}
                      onClick={() => !locked && (setCurrentChapter(i), setCurrentPage(1))}
                      className="text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: currentChapter === i ? (dm ? "#1E2D4F" : "#EEF2FF") : "transparent",
                        color: locked ? (dm ? "#4B5563" : "#D1D5DB") : currentChapter === i ? "#3B5BDB" : text,
                        cursor: locked ? "not-allowed" : "pointer",
                        fontSize: "0.8rem",
                        fontWeight: currentChapter === i ? 600 : 400,
                        lineHeight: 1.4,
                      }}
                      disabled={locked}
                      aria-current={currentChapter === i ? "true" : undefined}
                    >
                      {locked ? (
                        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : (
                        <span
                          className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center"
                          style={{
                            backgroundColor: currentChapter === i ? "#3B5BDB" : "transparent",
                            color: currentChapter === i ? "white" : muted,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                          }}
                        >
                          {i + 1}
                        </span>
                      )}
                      {ch.title}
                    </button>
                  );
                })}
              </div>

              {isGuest && (
                <div
                  className="mt-4 p-3 rounded-xl"
                  style={{ backgroundColor: dm ? "#1E2D4F" : "#EEF2FF", border: `1px solid ${dm ? "#2A3F6F" : "#C7D2FE"}` }}
                >
                  <p style={{ fontSize: "0.75rem", color: dm ? "#93C5FD" : "#3730A3", lineHeight: 1.5 }}>
                    {previewChapters} dari {book.chapters.length} bab tersedia untuk tamu.
                  </p>
                  <button
                    onClick={() => onNavigate("register")}
                    className="mt-2 w-full py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: "#3B5BDB", fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    Daftar untuk Akses Penuh
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Reading Area */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center py-10 px-4" style={{ backgroundColor: bg }}>
          {isLocked ? (
            /* Lock Screen */
            <div className="flex flex-col items-center justify-center flex-1 max-w-md text-center py-20">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: dm ? "#1E2D4F" : "#EEF2FF" }}
              >
                <Lock className="w-10 h-10" style={{ color: "#3B5BDB" }} />
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: text, marginBottom: "0.75rem" }}>
                Konten Terkunci
              </h2>
              <p style={{ fontSize: "0.95rem", color: muted, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Anda sudah membaca bagian preview. Daftar sebagai pengguna Pustakability untuk mengakses{" "}
                <strong>{book.chapters.length} bab</strong> penuh dari buku ini.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => onNavigate("register")}
                  className="py-3.5 rounded-xl font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0A1172, #3B5BDB)", fontSize: "1rem" }}
                >
                  Daftar Sekarang — Gratis
                </button>
                <button
                  onClick={() => onNavigate("login")}
                  className="py-3 rounded-xl"
                  style={{
                    border: `1.5px solid ${dm ? "#1E2D4F" : "#E5E7EB"}`,
                    color: text,
                    fontSize: "0.9rem",
                  }}
                >
                  Sudah punya akun? Masuk
                </button>
              </div>
            </div>
          ) : (
            /* Book Content */
            <div
              className="w-full max-w-2xl rounded-2xl shadow-sm"
              style={{ backgroundColor: readingBg, border: `1px solid ${dm ? "#1E2D4F" : "#F0F0F0"}` }}
            >
              {/* Chapter Header */}
              <div
                className="px-10 pt-10 pb-6"
                style={{ borderBottom: `1px solid ${dm ? "#1E2D4F" : "#F5F5F5"}` }}
              >
                <div style={{ fontSize: "0.75rem", color: muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  {book.title}
                </div>
                <div className="flex items-center justify-between">
                  <h1 style={{ fontSize: `${1.5 + (fontSizeOffset * 0.1)}rem`, fontWeight: 700, color: text, lineHeight: 1.3 }}>
                    {chapter?.title}
                  </h1>
                  
                  {/* TTS Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={toggleTTS}
                      className={`p-2.5 rounded-full transition-colors ${highContrast ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-[#EEF2FF] text-[#3B5BDB] hover:bg-[#E0E7FF]"}`}
                      aria-label={isPlaying && !isPaused ? "Jeda Audio" : "Putar Audio"}
                    >
                      {isPlaying && !isPaused ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    {isPlaying && (
                      <button
                        onClick={stopTTS}
                        className={`p-2.5 rounded-full transition-colors ${highContrast ? "text-yellow-400 hover:bg-yellow-400/20" : "text-gray-500 hover:bg-gray-100"}`}
                        aria-label="Berhenti Audio"
                      >
                        <Square className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="px-10 py-8"
                style={{ 
                  fontSize: `${1 + (fontSizeOffset * 0.1)}rem`, 
                  lineHeight: lineSpacing === 1 ? 1.7 : lineSpacing === 2 ? 2.2 : 2.8, 
                  color: text 
                }}
                aria-live="polite"
              >
                {chapter?.content.split("\n\n").map((para, i) => (
                  <p key={i} style={{ marginBottom: "1.25rem" }}>
                    {para}
                  </p>
                ))}

                {isGuest && (
                  <div
                    className="mt-8 p-6 rounded-xl text-center"
                    style={{ backgroundColor: dm ? "#1E2D4F" : "#EEF2FF", border: `2px dashed ${dm ? "#2A3F6F" : "#C7D2FE"}` }}
                  >
                    <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: "#3B5BDB" }} />
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: dm ? "#93C5FD" : "#3730A3" }}>
                      Ini adalah akhir dari preview bab pertama
                    </p>
                    <p style={{ fontSize: "0.8rem", color: muted, marginTop: "0.375rem", marginBottom: "1rem" }}>
                      Daftar gratis untuk membaca {book.chapters.length - 1} bab berikutnya
                    </p>
                    <button
                      onClick={() => onNavigate("register")}
                      className="px-6 py-2.5 rounded-xl text-white font-semibold"
                      style={{ background: "linear-gradient(135deg, #0A1172, #3B5BDB)", fontSize: "0.875rem" }}
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar */}
      {!isLocked && (
        <footer
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ backgroundColor: headerBg, borderTop: `1px solid ${headerBorder}`, height: "56px" }}
        >
          <button
            onClick={goPrevChapter}
            disabled={currentChapter === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              color: currentChapter === 0 ? (dm ? "#374151" : "#D1D5DB") : text,
              border: `1px solid ${currentChapter === 0 ? (dm ? "#1E2D4F" : "#E5E7EB") : (dm ? "#2A3F6F" : "#CBD5E1")}`,
              cursor: currentChapter === 0 ? "not-allowed" : "pointer",
              fontSize: "0.85rem",
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Bab Sebelumnya
          </button>

          <div style={{ fontSize: "0.8rem", color: muted }}>
            Bab {currentChapter + 1} / {canReadFull ? book.chapters.length : previewChapters}
          </div>

          <button
            onClick={goNextChapter}
            disabled={currentChapter >= (canReadFull ? book.chapters.length - 1 : previewChapters - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              color: "white",
              backgroundColor: currentChapter >= (canReadFull ? book.chapters.length - 1 : previewChapters - 1)
                ? (dm ? "#1E2D4F" : "#E5E7EB")
                : "#3B5BDB",
              cursor: currentChapter >= (canReadFull ? book.chapters.length - 1 : previewChapters - 1) ? "not-allowed" : "pointer",
              fontSize: "0.85rem",
            }}
          >
            Bab Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      )}

      {/* Accessibility Widget */}
      <AccessibilityWidget
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
        fontSize={fontSizeOffset}
        onFontSizeChange={(delta, reset) => setFontSizeOffset(reset ? 0 : Math.max(-2, Math.min(6, fontSizeOffset + delta)))}
        dyslexiaFont={dyslexiaFont}
        onDyslexiaFontToggle={() => setDyslexiaFont(!dyslexiaFont)}
        lineSpacing={lineSpacing}
        onLineSpacingChange={setLineSpacing}
      />
    </div>
  );
}

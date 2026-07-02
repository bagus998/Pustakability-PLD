import { useState } from "react";
import { Search, Grid, List } from "lucide-react";
import { allBooks, categories } from "../data/books";
import { BookCard } from "./BookCatalogSection";
import type { UserRole, Page } from "../App";
import { useTranslation, Trans } from "react-i18next";

interface CatalogPageProps {
  darkMode: boolean;
  role: UserRole;
  onOpenBook: (bookId: string) => void;
  onNavigate: (page: Page) => void;
}

export function CatalogPage({ darkMode: dm, role, onOpenBook, onNavigate }: CatalogPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formats = [
    { id: "all", label: t("catalogPage.filter_all_formats") },
    { id: "Audio", label: "Audio" },
    { id: "PDF", label: "PDF" },
    { id: "DAISY", label: "DAISY" },
    { id: "Braille", label: "Braille" }
  ];

  const sortOptions = [
    { id: "relevance", label: t("catalogPage.sort_relevance") },
    { id: "newest", label: t("catalogPage.sort_newest") },
    { id: "rating", label: t("catalogPage.sort_rating") },
    { id: "az", label: t("catalogPage.sort_az") }
  ];

  const bg = dm ? "#0D1117" : "#F5F7FF";
  const card = dm ? "#161B2E" : "#FFFFFF";
  const border = dm ? "#1E2D4F" : "#E5E7EB";
  const text = dm ? "#F1F5F9" : "#0F1B35";
  const muted = dm ? "#94A3B8" : "#6B7280";
  const inputBg = dm ? "#161B2E" : "#FFFFFF";
  const pillActive = dm ? "#3B5BDB" : "#0A1172";

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || book.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "all" ||
      book.formats.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase()));
    return matchesSearch && matchesCategory && matchesFormat;
  });

  // Basic sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (selectedSort === "newest") return parseInt(b.year) - parseInt(a.year);
    if (selectedSort === "rating") return b.rating - a.rating;
    if (selectedSort === "az") return a.title.localeCompare(b.title);
    return 0; // relevance (default order)
  });

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: bg }}>
      {/* Header */}
      <div
        className="py-10 px-4 sm:px-6 lg:px-8"
        style={{ background: dm ? "#0F1623" : "linear-gradient(135deg, #0A1172, #132060)" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white mb-2" style={{ fontSize: "2rem", fontWeight: 700 }}>
            {t("catalogPage.title")}
          </h1>
          <p className="text-blue-200 mb-6" style={{ fontSize: "0.95rem" }}>
            {t("catalogPage.subtitle", { count: allBooks.length })}
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("catalogPage.search_placeholder")}
              aria-label="Cari buku"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-white placeholder-blue-300 focus:bg-white/15 transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "1rem",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00D4AC")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.2)")}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            <button
              onClick={() => setSelectedCategory("Semua")}
              aria-pressed={selectedCategory === "Semua"}
              className="px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
              style={{
                backgroundColor: selectedCategory === "Semua" ? pillActive : (dm ? "#1A2240" : "#FFFFFF"),
                color: selectedCategory === "Semua" ? "white" : muted,
                border: `1px solid ${selectedCategory === "Semua" ? pillActive : border}`,
                fontSize: "0.8rem",
              }}
            >
              {t("catalogPage.category_all")}
            </button>
            {categories.filter(cat => cat !== "Semua").map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className="px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                style={{
                  backgroundColor: selectedCategory === cat ? pillActive : (dm ? "#1A2240" : "#FFFFFF"),
                  color: selectedCategory === cat ? "white" : muted,
                  border: `1px solid ${selectedCategory === cat ? pillActive : border}`,
                  fontSize: "0.8rem",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Format Filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              aria-label="Filter format"
              className="px-3 py-1.5 rounded-lg outline-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text, fontSize: "0.8rem" }}
            >
              {formats.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              aria-label="Urutkan"
              className="px-3 py-1.5 rounded-lg outline-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text, fontSize: "0.8rem" }}
            >
              {sortOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>

            {/* View Mode */}
            <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${border}` }}>
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  aria-pressed={viewMode === v}
                  aria-label={v === "grid" ? "Tampilan grid" : "Tampilan daftar"}
                  className="p-2 transition-colors"
                  style={{
                    backgroundColor: viewMode === v ? pillActive : inputBg,
                    color: viewMode === v ? "white" : muted,
                  }}
                >
                  {v === "grid" ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-5" style={{ fontSize: "0.85rem", color: muted }}>
          <Trans i18nKey="catalogPage.showing_results" count={sortedBooks.length}>
            Showing <strong style={{ color: text }}>{{count: sortedBooks.length}}</strong> collections
          </Trans>
          {searchQuery && (
            <Trans i18nKey="catalogPage.for_query" values={{ query: searchQuery }}>
               for "<strong style={{ color: text }}>{{query: searchQuery}}</strong>"
            </Trans>
          )}
        </div>

        {/* Books */}
        {sortedBooks.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {sortedBooks.map((book) => (
                <BookCard key={book.id} book={book} darkMode={dm} role={role} onOpenBook={onOpenBook} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
                  style={{ backgroundColor: card, border: `1px solid ${border}` }}
                  onClick={() => onOpenBook(book.id)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onOpenBook(book.id)}
                  role="button"
                  aria-label={`Buka ${book.title}`}
                >
                  {/* Cover thumbnail */}
                  <div className="w-16 h-22 rounded-xl overflow-hidden flex-shrink-0" style={{ aspectRatio: "3/4", height: "88px" }}>
                    <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: text }}>{book.title}</div>
                    <div style={{ fontSize: "0.8rem", color: muted, marginTop: "0.2rem" }}>{book.author}</div>
                    <div style={{ fontSize: "0.75rem", color: muted }}>{book.publisher} · {book.year}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {book.formats.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded-md" style={{ backgroundColor: dm ? "#1E2D4F" : "#F3F4F6", color: muted, fontSize: "0.7rem" }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${book.coverColor}18`, color: book.coverColor, fontSize: "0.72rem", fontWeight: 500 }}>
                      {book.category}
                    </span>
                    <div style={{ fontSize: "0.8rem", color: "#FBBF24", fontWeight: 600 }}>★ {book.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <p style={{ color: muted, fontSize: "1rem" }}>{t("catalogPage.empty_state")}</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("Semua"); setSelectedFormat("all"); }}
              className="mt-4 px-5 py-2 rounded-xl"
              style={{ border: `1.5px solid ${border}`, color: text, fontSize: "0.875rem" }}
            >
              {t("catalogPage.btn_reset")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

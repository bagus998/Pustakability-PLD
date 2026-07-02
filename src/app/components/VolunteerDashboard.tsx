import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Plus, Clock, CheckCircle, XCircle, BookOpen, Upload } from "lucide-react";
import type { AuthUser, Page } from "../App";
import { categories } from "../data/books";

interface VolunteerDashboardProps {
  darkMode: boolean;
  user: AuthUser;
  onNavigate: (page: Page) => void;
}

type Tab = "submissions" | "add";

const mySubmissions = [
  {
    id: "p1",
    title: "Antropologi Budaya Nusantara",
    author: "Dr. Maya Sari, M.Hum.",
    category: "Sosial",
    status: "pending",
    submittedAt: "2024-04-10",
  },
];

const formatOptions = ["Audio", "PDF Aksesibel", "DAISY", "Braille Digital"];

export function VolunteerDashboard({ darkMode: dm, user, onNavigate }: VolunteerDashboardProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState(mySubmissions);
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    category: "",
    year: new Date().getFullYear().toString(),
    description: "",
    coverUrl: "",
    formats: [] as string[],
    uploadMethod: "file" as "file" | "paste",
    bookContent: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const bg = dm ? "#0D1117" : "#F5F7FF";
  const card = dm ? "#161B2E" : "#FFFFFF";
  const border = dm ? "#1E2D4F" : "#E5E7EB";
  const text = dm ? "#F1F5F9" : "#0F1B35";
  const muted = dm ? "#94A3B8" : "#6B7280";
  const inputBg = dm ? "#0D1117" : "#F9FAFB";

  const inputStyle = {
    backgroundColor: inputBg,
    border: `1.5px solid ${border}`,
    color: text,
    fontSize: "0.9rem",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
  };

  const toggleFormat = (fmt: string) => {
    setForm(f => ({
      ...f,
      formats: f.formats.includes(fmt) ? f.formats.filter(x => x !== fmt) : [...f.formats, fmt],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmissions(prev => [
      {
        id: `p${Date.now()}`,
        title: form.title,
        author: form.author,
        category: form.category,
        status: "pending",
        submittedAt: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setTab("submissions"); setForm({ title: "", author: "", publisher: "", category: "", year: new Date().getFullYear().toString(), description: "", coverUrl: "", formats: [], uploadMethod: "file", bookContent: "" }); }, 2500);
  };

  const statusBadge: Record<string, { bg: string; text: string; label: string; icon: React.FC<any> }> = {
    pending: { bg: "#FEF9C3", text: "#854D0E", label: t("volunteerDashboard.status_pending"), icon: Clock },
    approved: { bg: "#DCFCE7", text: "#166534", label: t("volunteerDashboard.status_approved"), icon: CheckCircle },
    rejected: { bg: "#FEE2E2", text: "#991B1B", label: t("volunteerDashboard.status_rejected"), icon: XCircle },
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: bg }}>
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8" style={{ background: "linear-gradient(135deg, #0D7070, #0A1172)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="w-6 h-6 text-[#00D4AC]" />
            <h1 className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
              {t("volunteerDashboard.title")}
            </h1>
          </div>
          <p className="text-blue-200" style={{ fontSize: "0.9rem" }}>
            <Trans i18nKey="volunteerDashboard.greeting" values={{ name: user.name }}>
              Hello, <strong>{{name: user.name}}</strong>! Contribute books to the Pustakability collection.
            </Trans>
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ backgroundColor: card, borderBottom: `1px solid ${border}` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {[
              { id: "submissions" as Tab, label: t("volunteerDashboard.tab_submissions", { count: submissions.length }) },
              { id: "add" as Tab, label: t("volunteerDashboard.tab_add") },
            ].map(tObj => (
              <button
                key={tObj.id}
                onClick={() => setTab(tObj.id)}
                className="px-5 py-4 border-b-2 transition-colors whitespace-nowrap"
                style={{
                  borderBottomColor: tab === tObj.id ? "#3B5BDB" : "transparent",
                  color: tab === tObj.id ? "#3B5BDB" : muted,
                  fontSize: "0.875rem",
                  fontWeight: tab === tObj.id ? 600 : 400,
                }}
              >
                {tObj.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Submissions Tab */}
        {tab === "submissions" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: text }}>{t("volunteerDashboard.submissions_title")}</h2>
              <button
                onClick={() => setTab("add")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                style={{ backgroundColor: "#0A1172", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <Plus className="w-4 h-4" />
                {t("volunteerDashboard.btn_add_book")}
              </button>
            </div>

            {submissions.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ backgroundColor: card, border: `1px solid ${border}` }}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: muted }} />
                <p style={{ color: muted }}>{t("volunteerDashboard.empty_submissions")}</p>
                <button
                  onClick={() => setTab("add")}
                  className="mt-4 px-5 py-2 rounded-xl text-white"
                  style={{ backgroundColor: "#0A1172", fontSize: "0.875rem" }}
                >
                  {t("volunteerDashboard.btn_first_submission")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {submissions.map((s) => {
                  const st = statusBadge[s.status];
                  const StatusIcon = st.icon;
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl p-5 flex items-start justify-between gap-4"
                      style={{ backgroundColor: card, border: `1px solid ${border}` }}
                    >
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: text }}>{s.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: muted }}>{s.author} · {s.category}</p>
                        <p style={{ fontSize: "0.75rem", color: muted, marginTop: "0.25rem" }}>
                          {t("volunteerDashboard.submitted_at", { date: s.submittedAt })}
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: st.bg, color: st.text, fontSize: "0.78rem", fontWeight: 600 }}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Info box */}
            <div
              className="mt-6 rounded-xl p-4"
              style={{ backgroundColor: dm ? "#1E2D4F" : "#EEF2FF", border: `1px solid ${dm ? "#2A3F6F" : "#C7D2FE"}` }}
            >
              <p style={{ fontSize: "0.8rem", color: dm ? "#93C5FD" : "#3730A3", lineHeight: 1.6 }}>
                <strong>{t("volunteerDashboard.validation_info_title")}</strong> {t("volunteerDashboard.validation_info_desc")}
              </p>
            </div>
          </div>
        )}

        {/* Add Book Tab */}
        {tab === "add" && (
          <div className="rounded-2xl p-6" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: text, marginBottom: "1.5rem" }}>
              {t("volunteerDashboard.form_title")}
            </h2>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: text }}>{t("volunteerDashboard.form_success_title")}</h3>
                <p style={{ fontSize: "0.9rem", color: muted, marginTop: "0.5rem" }}>
                  {t("volunteerDashboard.form_success_desc")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_book_title")} <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder={t("volunteerDashboard.field_book_title_placeholder")}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_author")} <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={e => setForm({ ...form, author: e.target.value })}
                      placeholder={t("volunteerDashboard.field_author_placeholder")}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_publisher")}
                    </label>
                    <input
                      type="text"
                      value={form.publisher}
                      onChange={e => setForm({ ...form, publisher: e.target.value })}
                      placeholder={t("volunteerDashboard.field_publisher_placeholder")}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_category")} <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      required
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="">{t("volunteerDashboard.field_category_placeholder")}</option>
                      {categories.filter(c => c !== "Semua").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_year")}
                    </label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={e => setForm({ ...form, year: e.target.value })}
                      min="1900"
                      max="2030"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                    {t("volunteerDashboard.field_desc")} <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder={t("volunteerDashboard.field_desc_placeholder")}
                    required
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                    {t("volunteerDashboard.field_cover")}
                  </label>
                  <input
                    type="url"
                    value={form.coverUrl}
                    onChange={e => setForm({ ...form, coverUrl: e.target.value })}
                    placeholder={t("volunteerDashboard.field_cover_placeholder")}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.5rem" }}>
                    {t("volunteerDashboard.field_formats")} <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formatOptions.map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => toggleFormat(fmt)}
                        className="px-4 py-2 rounded-xl transition-all"
                        style={{
                          border: `2px solid ${form.formats.includes(fmt) ? "#0A1172" : border}`,
                          backgroundColor: form.formats.includes(fmt) ? (dm ? "#1E2D4F" : "#EEF2FF") : "transparent",
                          color: form.formats.includes(fmt) ? "#3B5BDB" : muted,
                          fontSize: "0.85rem",
                          fontWeight: form.formats.includes(fmt) ? 600 : 400,
                        }}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                  {form.formats.length === 0 && (
                    <p style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: "0.25rem" }}>
                      {t("volunteerDashboard.error_min_format")}
                    </p>
                  )}
                </div>

                {/* Upload Method Toggle */}
                <div>
                  <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.5rem" }}>
                    {t("volunteerDashboard.field_upload_method")}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, uploadMethod: "file" })}
                      className="flex-1 py-2 rounded-xl border transition-all"
                      style={{
                        borderColor: form.uploadMethod === "file" ? "#0A1172" : border,
                        backgroundColor: form.uploadMethod === "file" ? (dm ? "#1E2D4F" : "#EEF2FF") : "transparent",
                        color: form.uploadMethod === "file" ? "#3B5BDB" : muted,
                        fontSize: "0.85rem",
                        fontWeight: form.uploadMethod === "file" ? 600 : 400,
                      }}
                    >
                      {t("volunteerDashboard.upload_method_file")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, uploadMethod: "paste" })}
                      className="flex-1 py-2 rounded-xl border transition-all"
                      style={{
                        borderColor: form.uploadMethod === "paste" ? "#0A1172" : border,
                        backgroundColor: form.uploadMethod === "paste" ? (dm ? "#1E2D4F" : "#EEF2FF") : "transparent",
                        color: form.uploadMethod === "paste" ? "#3B5BDB" : muted,
                        fontSize: "0.85rem",
                        fontWeight: form.uploadMethod === "paste" ? 600 : 400,
                      }}
                    >
                      {t("volunteerDashboard.upload_method_paste")}
                    </button>
                  </div>
                </div>

                {/* File / Paste input */}
                {form.uploadMethod === "file" ? (
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_book_file")} <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="file"
                      accept=".epub,.txt"
                      className="w-full"
                      style={{ ...inputStyle, padding: "0.6rem" }}
                      required={form.uploadMethod === "file"}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: "0.875rem", fontWeight: 500, color: text, display: "block", marginBottom: "0.375rem" }}>
                      {t("volunteerDashboard.field_book_text")} <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      value={form.bookContent}
                      onChange={e => setForm({ ...form, bookContent: e.target.value })}
                      placeholder={t("volunteerDashboard.field_book_text_placeholder")}
                      required={form.uploadMethod === "paste"}
                      rows={6}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                )}

                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: dm ? "#1E2D4F" : "#FEF9C3", border: `1px solid ${dm ? "#2A3F6F" : "#FDE68A"}` }}
                >
                  <p style={{ fontSize: "0.8rem", color: dm ? "#FCD34D" : "#92400E", lineHeight: 1.5 }}>
                    <strong>{t("volunteerDashboard.copyright_info_title")}</strong> {t("volunteerDashboard.copyright_info_desc")}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || form.formats.length === 0}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{
                    background: (loading || form.formats.length === 0) ? "#94A3B8" : "linear-gradient(135deg, #0A1172, #3B5BDB)",
                    fontSize: "1rem",
                    cursor: (loading || form.formats.length === 0) ? "not-allowed" : "pointer",
                  }}
                >
                  <Upload className="w-4 h-4" />
                  {loading ? t("volunteerDashboard.btn_submitting") : t("volunteerDashboard.btn_submit")}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

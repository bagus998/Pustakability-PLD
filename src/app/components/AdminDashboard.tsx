import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, BookOpen, CheckCircle, XCircle, Clock, Trash2, Edit2, Shield, UserCheck, UserX, BarChart3 } from "lucide-react";
import { allBooks, pendingBooks } from "../data/books";
import type { Page } from "../App";

interface AdminDashboardProps {
  darkMode: boolean;
  onNavigate: (page: Page) => void;
}

type Tab = "overview" | "users" | "books" | "validasi";

const mockUsers = [
  { id: "1", name: "Siti Rahayu", email: "mahasiswa@ub.ac.id", role: "user", faculty: "MIPA", status: "active", joined: "2024-03-10" },
  { id: "2", name: "Ahmad Fauzan", email: "ahmad@student.ub.ac.id", role: "user", faculty: "Hukum", status: "active", joined: "2024-02-15" },
  { id: "3", name: "Budi Santoso", email: "relawan@ub.ac.id", role: "volunteer", faculty: "Teknik", status: "active", joined: "2024-01-20" },
  { id: "4", name: "Rizky Pratama", email: "rizky@student.ub.ac.id", role: "user", faculty: "Teknik", status: "pending", joined: "2024-04-01" },
  { id: "5", name: "Dewi Lestari", email: "dewi@student.ub.ac.id", role: "volunteer", faculty: "Ilmu Budaya", status: "active", joined: "2024-03-25" },
];

const roleColors: Record<string, string> = { admin: "#BE185D", user: "#0A1172", volunteer: "#0D7070" };
const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#DCFCE7", text: "#166534" },
  pending: { bg: "#FEF9C3", text: "#854D0E" },
  suspended: { bg: "#FEE2E2", text: "#991B1B" },
};

export function AdminDashboard({ darkMode: dm, onNavigate }: AdminDashboardProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("overview");
  const [pendingList, setPendingList] = useState(pendingBooks);

  const bg = dm ? "#0D1117" : "#F5F7FF";
  const card = dm ? "#161B2E" : "#FFFFFF";
  const border = dm ? "#1E2D4F" : "#E5E7EB";
  const text = dm ? "#F1F5F9" : "#0F1B35";
  const muted = dm ? "#94A3B8" : "#6B7280";
  const headerBg = dm ? "#0F1623" : "#0A1172";

  const tabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
    { id: "overview", label: t("adminDashboard.tab_overview"), icon: BarChart3 },
    { id: "users", label: t("adminDashboard.tab_users"), icon: Users },
    { id: "books", label: t("adminDashboard.tab_books"), icon: BookOpen },
    { id: "validasi", label: t("adminDashboard.tab_validation", { count: pendingList.length }), icon: Clock },
  ];

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: bg }}>
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: headerBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-6 h-6 text-[#00D4AC]" />
            <h1 className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
              {t("adminDashboard.title")}
            </h1>
          </div>
          <p className="text-blue-200" style={{ fontSize: "0.9rem" }}>
            {t("adminDashboard.subtitle")}
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ backgroundColor: card, borderBottom: `1px solid ${border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tObj) => {
              const Icon = tObj.icon;
              return (
                <button
                  key={tObj.id}
                  onClick={() => setTab(tObj.id)}
                  className="flex items-center gap-2 px-4 py-4 whitespace-nowrap transition-colors border-b-2"
                  style={{
                    borderBottomColor: tab === tObj.id ? "#3B5BDB" : "transparent",
                    color: tab === tObj.id ? "#3B5BDB" : muted,
                    fontSize: "0.875rem",
                    fontWeight: tab === tObj.id ? 600 : 400,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tObj.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {tab === "overview" && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { label: t("adminDashboard.stat_users"), value: mockUsers.length, sub: t("adminDashboard.stat_users_sub"), icon: Users, color: "#3B5BDB" },
                { label: t("adminDashboard.stat_books"), value: allBooks.length, sub: t("adminDashboard.stat_books_sub"), icon: BookOpen, color: "#0D7070" },
                { label: t("adminDashboard.stat_pending"), value: pendingList.length, sub: t("adminDashboard.stat_pending_sub"), icon: Clock, color: "#D97706" },
                { label: t("adminDashboard.stat_active"), value: mockUsers.filter(u => u.status === "active").length, sub: t("adminDashboard.stat_active_sub"), icon: UserCheck, color: "#16A34A" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}18` }}>
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 700, color: text, lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, color: text, marginTop: "0.25rem" }}>{stat.label}</div>
                    <div style={{ fontSize: "0.75rem", color: muted, marginTop: "0.25rem" }}>{stat.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: t("adminDashboard.action_validation"), action: () => setTab("validasi"), color: "#D97706", icon: Clock },
                { label: t("adminDashboard.action_users"), action: () => setTab("users"), color: "#3B5BDB", icon: Users },
                { label: t("adminDashboard.action_books"), action: () => setTab("books"), color: "#0D7070", icon: BookOpen },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <button
                    key={i}
                    onClick={a.action}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: card, border: `1px solid ${border}`, color: text }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${a.color}18` }}>
                      <Icon className="w-5 h-5" style={{ color: a.color }} />
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="p-5" style={{ borderBottom: `1px solid ${border}` }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: text }}>{t("adminDashboard.users_title")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {[
                      t("adminDashboard.col_name"),
                      t("adminDashboard.col_email"),
                      t("adminDashboard.col_role"),
                      t("adminDashboard.col_faculty"),
                      t("adminDashboard.col_status"),
                      t("adminDashboard.col_joined"),
                      t("adminDashboard.col_actions")
                    ].map(h => (
                      <th key={h} className="px-5 py-3 text-left" style={{ fontSize: "0.75rem", fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: roleColors[u.role] ?? "#0A1172", fontSize: "0.75rem", fontWeight: 700 }}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: text }}>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: "0.85rem", color: muted }}>{u.email}</td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full capitalize"
                          style={{ backgroundColor: `${roleColors[u.role]}18`, color: roleColors[u.role], fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          {t(`register.role_${u.role}`, { defaultValue: u.role })}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: "0.85rem", color: muted }}>
                        {t(`register.faculties.${u.faculty}`, { defaultValue: u.faculty })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full capitalize"
                          style={{ backgroundColor: statusColors[u.status]?.bg, color: statusColors[u.status]?.text, fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          {u.status === "active" ? t("adminDashboard.status_active") : u.status === "pending" ? t("adminDashboard.status_pending") : t("adminDashboard.status_suspended")}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: "0.85rem", color: muted }}>{u.joined}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Edit" style={{ color: "#3B5BDB" }}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Hapus" style={{ color: "#DC2626" }}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {tab === "books" && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${border}` }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: text }}>{t("adminDashboard.books_title", { count: allBooks.length })}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {[
                      t("adminDashboard.col_title"),
                      t("adminDashboard.col_author"),
                      t("adminDashboard.col_category"),
                      t("adminDashboard.col_format"),
                      t("adminDashboard.col_status"),
                      t("adminDashboard.col_actions")
                    ].map(h => (
                      <th key={h} className="px-5 py-3 text-left" style={{ fontSize: "0.75rem", fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allBooks.map((b) => (
                    <tr key={b.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td className="px-5 py-3">
                        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: text }}>{b.title}</div>
                        <div style={{ fontSize: "0.75rem", color: muted }}>{b.year}</div>
                      </td>
                      <td className="px-5 py-3" style={{ fontSize: "0.85rem", color: muted }}>{b.author}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${b.coverColor}18`, color: b.coverColor, fontSize: "0.75rem", fontWeight: 500 }}>
                          {b.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {b.formats.map(f => (
                            <span key={f} className="px-2 py-0.5 rounded-full" style={{ backgroundColor: dm ? "#1E2D4F" : "#F3F4F6", color: muted, fontSize: "0.7rem" }}>{f}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#166534", fontSize: "0.75rem", fontWeight: 600 }}>
                          {t("adminDashboard.status_active")}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" style={{ color: "#3B5BDB" }}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#DC2626" }}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Validasi Tab */}
        {tab === "validasi" && (
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: text, marginBottom: "1rem" }}>
              {t("adminDashboard.validation_title")}
            </h2>
            {pendingList.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ backgroundColor: card, border: `1px solid ${border}` }}
              >
                <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#16A34A" }} />
                <p style={{ fontSize: "1rem", color: muted }}>{t("adminDashboard.validation_empty")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingList.map((book) => (
                  <div
                    key={book.id}
                    className="rounded-2xl p-5 flex items-start gap-4"
                    style={{ backgroundColor: card, border: `1px solid ${border}` }}
                  >
                    <div
                      className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: book.coverColor }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: text }}>{book.title}</h3>
                          <p style={{ fontSize: "0.85rem", color: muted }}>{book.author} · {book.category} · {book.year}</p>
                          <p style={{ fontSize: "0.8rem", color: muted, marginTop: "0.375rem", lineHeight: 1.5 }}>{book.description}</p>
                          <div className="flex gap-1.5 mt-2">
                            {book.formats.map(f => (
                              <span key={f} className="px-2 py-0.5 rounded-full" style={{ backgroundColor: dm ? "#1E2D4F" : "#F3F4F6", color: muted, fontSize: "0.7rem" }}>{f}</span>
                            ))}
                          </div>
                          <p style={{ fontSize: "0.75rem", color: muted, marginTop: "0.5rem" }}>
                            {t("adminDashboard.submitted_by")} <span style={{ color: dm ? "#93C5FD" : "#3B5BDB" }}>{book.submittedBy}</span>
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#FEF9C3", color: "#854D0E", fontSize: "0.75rem", fontWeight: 600 }}>
                          {t("adminDashboard.status_pending")}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => setPendingList(prev => prev.filter(p => p.id !== book.id))}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
                          style={{ backgroundColor: "#16A34A", fontSize: "0.875rem" }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t("adminDashboard.btn_approve")}
                        </button>
                        <button
                          onClick={() => setPendingList(prev => prev.filter(p => p.id !== book.id))}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium"
                          style={{ border: `1px solid #FCA5A5`, color: "#DC2626", backgroundColor: "#FEF2F2", fontSize: "0.875rem" }}
                        >
                          <XCircle className="w-4 h-4" />
                          {t("adminDashboard.btn_reject")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

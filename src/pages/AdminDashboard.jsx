import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineClock, HiOutlineBell, HiOutlineArrowRight } from "react-icons/hi2";
import { HiOutlineUserGroup, HiOutlineUserAdd, HiOutlineClipboardCheck, HiOutlineOfficeBuilding, HiOutlineHome, HiOutlineClock as HiClockHistory, HiOutlineClipboardList, HiOutlineCog, HiOutlineLogout, HiOutlineMail } from "react-icons/hi";
import { useDemo } from "../context/DemoContext";

export default function AdminDashboard() {
  const { currentUser, staffList, attendance, addStaff, deactivateStaff, deleteStaff, logout } = useDemo();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    addStaff(form);
    setForm({ name: "", email: "", password: "", department: "" });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const staffName = (uid) => staffList.find((s) => s.uid === uid)?.name || uid;
  const activeCount = staffList.filter((s) => s.active !== false).length;
  const initials = currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "A";

  const AttendanceTable = ({ rows }) => (
    <div style={styles.tableScroll}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Staff</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Clock in</th>
            <th style={styles.th}>Clock out</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice().reverse().map((r) => (
            <tr key={r.id}>
              <td style={styles.td}>{staffName(r.staff_id)}</td>
              <td style={styles.td}>{r.date}</td>
              <td style={styles.td}>{r.clock_in || "-"}</td>
              <td style={styles.td}>{r.clock_out || "-"}</td>
              <td style={styles.td}>
                <span style={styles.presentBadge}>
                  <span style={styles.presentDot} /> {r.clock_out ? "Complete" : "Present"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.brandRow}>
            <div style={styles.logoBox}>
              <HiOutlineClock size={20} color="#fff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={styles.brandName}>Crown</p>
              <p style={styles.brandSub}>Admin dashboard</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.iconButton} aria-label="Notifications">
              <HiOutlineBell size={18} color="#374151" />
              <span style={styles.notifDot} />
            </button>
            <div style={styles.avatarSmall}>{initials}</div>
            <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
          </div>
        </div>

        {activeTab === "home" && (
          <>
            <h1 style={styles.greeting}>Good morning, {currentUser?.name?.split(" ")[0]} <span>👋</span></h1>
            <p style={styles.subGreeting}>Here's your team overview for today.</p>

            <div style={styles.statsGrid}>
              <StatCard icon={<HiOutlineUserGroup size={18} color="#1D4ED8" />} iconBg="#DCE9FE" label="Total staff" value={staffList.length} unit="Members" />
              <StatCard icon={<HiOutlineClipboardCheck size={18} color="#0F766E" />} iconBg="#D4F1EA" label="Active" value={activeCount} unit="Staff" />
              <StatCard icon={<HiOutlineUserAdd size={18} color="#6D28D9" />} iconBg="#E9DFFC" label="Records logged" value={attendance.length} unit="Total" />
              <StatCard icon={<HiOutlineOfficeBuilding size={18} color="#B45309" />} iconBg="#FCEBD1" label="Departments" value={new Set(staffList.map((s) => s.department)).size} unit="Active" />
            </div>

            <div style={styles.card}>
              <div style={styles.tableHeader}>
                <h2 style={styles.cardTitle}>Recent activity</h2>
                <button style={styles.viewAllButton} onClick={() => setActiveTab("history")}>
                  View all <HiOutlineArrowRight size={14} color="#1D4ED8" />
                </button>
              </div>
              {attendance.length === 0 && <p style={styles.emptyText}>No attendance recorded yet.</p>}
              {attendance.length > 0 && <AttendanceTable rows={attendance.slice(-5)} />}
            </div>
          </>
        )}

        {activeTab === "attendance" && (
          <>
            <h1 style={styles.greeting}>Staff management</h1>
            <p style={styles.subGreeting}>Add staff and manage who's active on your team.</p>

            <div style={styles.grid}>
              <div style={{ ...styles.card, flex: "1 1 280px" }}>
                <h2 style={styles.cardTitle}>Add staff</h2>
                <form onSubmit={handleCreate}>
                  <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required style={styles.input} />
                  <input name="email" type="email" placeholder="name@company.com" value={form.email} onChange={handleChange} required style={styles.input} />
                  <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required style={styles.input} />
                  <input name="department" placeholder="Department" value={form.department} onChange={handleChange} style={styles.input} />
                  {error && <p style={styles.error}>{error}</p>}
                  <button type="submit" style={styles.primaryButton}>Create staff</button>
                </form>
              </div>

              <div style={{ ...styles.card, flex: "2 1 320px" }}>
                <h2 style={styles.cardTitle}>Staff ({staffList.length})</h2>
                {staffList.length === 0 && <p style={styles.emptyText}>No staff added yet.</p>}
                {staffList.map((s) => (
                  <div key={s.uid} style={styles.staffRow}>
                    <div style={styles.staffLeft}>
                      <div style={styles.miniAvatar}>{s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                      <div style={{ minWidth: 0 }}>
                        <p style={styles.staffName}>{s.name}</p>
                        <p style={styles.staffMeta}>{s.email} · {s.department}</p>
                      </div>
                    </div>
                    <div style={styles.staffActions}>
                      <span style={{ ...styles.statusBadge, ...(s.active === false ? styles.statusInactive : styles.statusActive) }}>
                        {s.active === false ? "Inactive" : "Active"}
                      </span>
                      <button onClick={() => deactivateStaff(s.uid)} style={styles.smallButton}>Deactivate</button>
                      <button onClick={() => deleteStaff(s.uid)} style={styles.smallButtonDanger}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <>
            <h1 style={styles.greeting}>Attendance history</h1>
            <p style={styles.subGreeting}>Full clock-in and clock-out log for your team.</p>

            <div style={styles.card}>
              {attendance.length === 0 && <p style={styles.emptyText}>No attendance recorded yet.</p>}
              {attendance.length > 0 && <AttendanceTable rows={attendance} />}
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h1 style={styles.greeting}>Settings</h1>
            <p style={styles.subGreeting}>Your account details.</p>

            <div style={{ ...styles.card, maxWidth: "480px" }}>
              <div style={styles.settingsRow}>
                <div style={styles.avatarLarge}>{initials}</div>
                <div>
                  <p style={styles.staffName}>{currentUser?.name}</p>
                  <p style={styles.staffMeta}>Administrator</p>
                </div>
              </div>
              <div style={styles.settingsDetail}>
                <HiOutlineMail size={16} color="#6B7280" />
                <span>{currentUser?.email}</span>
              </div>
              <div style={styles.settingsDetail}>
                <HiOutlineOfficeBuilding size={16} color="#6B7280" />
                <span>{currentUser?.department}</span>
              </div>
              <button onClick={handleLogout} style={styles.dangerButton}>
                <HiOutlineLogout size={16} /> Log out
              </button>
            </div>
          </>
        )}
      </div>

      <nav style={styles.bottomNav}>
        <NavItem icon={<HiOutlineHome size={20} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <NavItem icon={<HiClockHistory size={20} />} label="Attendance" active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} />
        <NavItem icon={<HiOutlineClipboardList size={20} />} label="History" active={activeTab === "history"} onClick={() => setActiveTab("history")} />
        <NavItem icon={<HiOutlineCog size={20} />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={styles.navItem}>
      <span style={{ color: active ? "#2F6FED" : "#6B7280" }}>{icon}</span>
      <span style={{ ...styles.navLabel, color: active ? "#2F6FED" : "#6B7280" }}>{label}</span>
      {active && <span style={styles.navUnderline} />}
    </button>
  );
}

function StatCard({ icon, iconBg, label, value, unit }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIconBox, background: iconBg }}>{icon}</div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statUnit}>{unit}</p>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#EEF2FA", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  container: { flex: 1, maxWidth: "1040px", width: "100%", margin: "0 auto", padding: "0 16px 24px", boxSizing: "border-box" },
  header: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", position: "sticky", top: 0, zIndex: 10, background: "#EEF2FA", paddingTop: "calc(12px + env(safe-area-inset-top))", paddingBottom: "8px" },
  brandRow: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0 },
  logoBox: { width: "38px", height: "38px", borderRadius: "11px", background: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandName: { fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 },
  brandSub: { fontSize: "11px", color: "#6B7280", margin: "1px 0 0" },
  headerRight: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
  iconButton: { position: "relative", width: "36px", height: "36px", borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  notifDot: { position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" },
  avatarSmall: { width: "36px", height: "36px", borderRadius: "50%", background: "#1F2937", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  avatarLarge: { width: "52px", height: "52px", borderRadius: "50%", background: "#1F2937", color: "#fff", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoutButton: { fontSize: "13px", color: "#374151", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "8px 14px", cursor: "pointer" },
  greeting: { fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 4px" },
  subGreeting: { fontSize: "13px", color: "#4B5563", margin: "0 0 18px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "18px" },
  statCard: { background: "#fff", borderRadius: "16px", padding: "14px", border: "1px solid #E5E7EB", minWidth: 0 },
  statIconBox: { width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" },
  statLabel: { fontSize: "12px", color: "#6B7280", margin: "0 0 2px" },
  statValue: { fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0 },
  statUnit: { fontSize: "12px", color: "#6B7280", margin: "2px 0 0" },
  grid: { display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "14px" },
  card: { background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "18px", marginBottom: "14px", minWidth: 0 },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 14px" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "4px" },
  viewAllButton: { display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#1D4ED8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 },
  input: { display: "block", width: "100%", padding: "11px 14px", marginBottom: "12px", fontSize: "15px", border: "1.5px solid #D1D5DB", borderRadius: "10px", background: "#fff", boxSizing: "border-box", outline: "none" },
  primaryButton: { width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700, color: "#fff", background: "#2F6FED", border: "none", borderRadius: "10px", cursor: "pointer" },
  dangerButton: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 18px", fontSize: "14px", fontWeight: 700, color: "#991B1B", background: "#FEE2E2", border: "none", borderRadius: "10px", cursor: "pointer", marginTop: "8px" },
  error: { fontSize: "13px", color: "#991B1B", background: "#FEE2E2", borderRadius: "8px", padding: "8px 12px", margin: "-2px 0 12px" },
  emptyText: { fontSize: "13px", color: "#6B7280" },
  staffRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #F3F4F6", gap: "10px", flexWrap: "wrap" },
  staffLeft: { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 },
  miniAvatar: { width: "34px", height: "34px", borderRadius: "50%", background: "#1F2937", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  staffName: { fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 },
  staffMeta: { fontSize: "12px", color: "#6B7280", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  staffActions: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" },
  statusBadge: { fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px" },
  statusActive: { background: "#D4F1EA", color: "#0F766E" },
  statusInactive: { background: "#F3F4F6", color: "#4B5563" },
  smallButton: { fontSize: "12px", padding: "6px 11px", border: "1px solid #D1D5DB", borderRadius: "8px", background: "#fff", color: "#374151", cursor: "pointer" },
  smallButtonDanger: { fontSize: "12px", padding: "6px 11px", border: "1px solid #FCA5A5", borderRadius: "8px", background: "#fff", color: "#991B1B", cursor: "pointer" },
  tableScroll: { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "480px" },
  th: { textAlign: "left", fontSize: "12px", color: "#6B7280", fontWeight: 600, padding: "8px 8px 8px 0", borderBottom: "1px solid #E5E7EB" },
  td: { fontSize: "13px", color: "#1F2937", padding: "12px 8px 12px 0", borderBottom: "1px solid #F3F4F6" },
  presentBadge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#0F766E", background: "#D4F1EA", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 },
  presentDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#0F766E" },
  settingsRow: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" },
  settingsDetail: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151", padding: "10px 0", borderTop: "1px solid #F3F4F6" },
  bottomNav: { background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", padding: "8px 8px calc(6px + env(safe-area-inset-bottom))", boxSizing: "border-box" },
  navItem: { flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px 2px" },
  navLabel: { fontSize: "10.5px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" },
  navUnderline: { position: "absolute", bottom: "-6px", width: "20px", height: "2px", background: "#2F6FED", borderRadius: "2px" },
};

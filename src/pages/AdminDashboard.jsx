import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";

export default function AdminDashboard() {
  const { currentUser, staffList, attendance, addStaff, deactivateStaff, deleteStaff, logout } = useDemo();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.brandRow}>
            <div style={styles.logoBox}>
              <Icon name="clock" size={20} color="#fff" />
            </div>
            <div>
              <p style={styles.brandName}>Crown</p>
              <p style={styles.brandSub}>Admin dashboard</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.iconButton}>
              <Icon name="bell" size={18} color="#6B7280" />
              <span style={styles.notifDot} />
            </button>
            <div style={styles.avatarSmall}>{initials}</div>
            <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
          </div>
        </div>

        <h1 style={styles.greeting}>Good morning, {currentUser?.name?.split(" ")[0]} <span>👋</span></h1>
        <p style={styles.subGreeting}>Here's your team overview for today.</p>

        <div style={styles.statsGrid}>
          <StatCard icon="users" iconBg="#E6F0FE" iconColor="#2F6FED" label="Total staff" value={staffList.length} unit="Members" />
          <StatCard icon="userCheck" iconBg="#E1F5EE" iconColor="#0F6E56" label="Active" value={activeCount} unit="Staff" />
          <StatCard icon="calendarCheck" iconBg="#F1E9FE" iconColor="#7F56D9" label="Records logged" value={attendance.length} unit="Total" />
          <StatCard icon="star" iconBg="#FEF3E2" iconColor="#E8A33D" label="Departments" value={new Set(staffList.map((s) => s.department)).size} unit="Active" />
        </div>

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
            <h2 style={styles.cardTitle}>Staff</h2>
            {staffList.length === 0 && <p style={styles.emptyText}>No staff added yet.</p>}
            {staffList.map((s) => (
              <div key={s.uid} style={styles.staffRow}>
                <div style={styles.staffLeft}>
                  <div style={styles.miniAvatar}>{s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                  <div>
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

        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Attendance history</h2>
            <button style={styles.viewAllButton}>
              View all <Icon name="arrowRight" size={14} color="#2F6FED" />
            </button>
          </div>
          {attendance.length === 0 && <p style={styles.emptyText}>No attendance recorded yet.</p>}
          {attendance.length > 0 && (
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
                  {attendance.slice().reverse().map((r) => (
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
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, iconColor, label, value, unit }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIconBox, background: iconBg }}>
        <Icon name={icon} size={18} color={iconColor} />
      </div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statUnit}>{unit}</p>
    </div>
  );
}

function Icon({ name, size = 20, color = "#000" }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
    case "bell":
      return <svg {...props}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>;
    case "users":
      return <svg {...props}><circle cx="9" cy="8" r="3" /><path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><circle cx="18" cy="9" r="2.5" /><path d="M16.5 21v-1a4 4 0 013-3.87" /></svg>;
    case "userCheck":
      return <svg {...props}><circle cx="9" cy="8" r="3" /><path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><path d="M17 11l2 2 4-4" /></svg>;
    case "calendarCheck":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4" /></svg>;
    case "star":
      return <svg {...props} fill={color} stroke="none"><path d="M12 2l3 6.5 7 1-5 5 1.5 7-6.5-3.5-6.5 3.5 1.5-7-5-5 7-1z" /></svg>;
    case "arrowRight":
      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    default:
      return null;
  }
}

const styles = {
  page: { minHeight: "100vh", background: "#F0F3FA", fontFamily: "'Inter', system-ui, sans-serif" },
  container: { maxWidth: "1040px", margin: "0 auto", padding: "24px 20px 60px" },
  header: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  brandRow: { display: "flex", alignItems: "center", gap: "12px" },
  logoBox: { width: "40px", height: "40px", borderRadius: "12px", background: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandName: { fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 },
  brandSub: { fontSize: "12px", color: "#9AA0B0", margin: "1px 0 0" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  iconButton: { position: "relative", width: "36px", height: "36px", borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  notifDot: { position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" },
  avatarSmall: { width: "36px", height: "36px", borderRadius: "50%", background: "#1A1D29", color: "#fff", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" },
  logoutButton: { fontSize: "13px", color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "8px 16px", cursor: "pointer" },
  greeting: { fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 4px" },
  subGreeting: { fontSize: "13px", color: "#6B7280", margin: "0 0 20px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "20px" },
  statCard: { background: "#fff", borderRadius: "16px", padding: "16px", border: "1px solid #EDEFF3" },
  statIconBox: { width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" },
  statLabel: { fontSize: "12px", color: "#9AA0B0", margin: "0 0 2px" },
  statValue: { fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 },
  statUnit: { fontSize: "12px", color: "#9AA0B0", margin: "2px 0 0" },
  grid: { display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" },
  card: { background: "#fff", border: "1px solid #EDEFF3", borderRadius: "16px", padding: "22px", marginBottom: "16px" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 16px" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  viewAllButton: { display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#2F6FED", background: "none", border: "none", cursor: "pointer", fontWeight: 500 },
  input: { display: "block", width: "100%", padding: "11px 14px", marginBottom: "12px", fontSize: "14px", border: "1.5px solid #E5E7EB", borderRadius: "10px", background: "#FAFAFA", boxSizing: "border-box", outline: "none" },
  primaryButton: { width: "100%", padding: "12px", fontSize: "14px", fontWeight: 600, color: "#fff", background: "#2F6FED", border: "none", borderRadius: "10px", cursor: "pointer" },
  error: { fontSize: "13px", color: "#B91C1C", background: "#FEECEC", borderRadius: "8px", padding: "8px 12px", margin: "-2px 0 12px" },
  emptyText: { fontSize: "13px", color: "#9AA0B0" },
  staffRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F3F3EF", gap: "10px", flexWrap: "wrap" },
  staffLeft: { display: "flex", alignItems: "center", gap: "12px" },
  miniAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#1A1D29", color: "#fff", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  staffName: { fontSize: "14px", fontWeight: 500, color: "#111827", margin: 0 },
  staffMeta: { fontSize: "12px", color: "#9AA0B0", margin: "2px 0 0" },
  staffActions: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  statusBadge: { fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px" },
  statusActive: { background: "#E1F5EE", color: "#0F6E56" },
  statusInactive: { background: "#F1EFE8", color: "#5F5E5A" },
  smallButton: { fontSize: "12px", padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff", cursor: "pointer" },
  smallButtonDanger: { fontSize: "12px", padding: "6px 12px", border: "1px solid #F0999B", borderRadius: "8px", background: "#fff", color: "#B91C1C", cursor: "pointer" },
  tableScroll: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  th: { textAlign: "left", fontSize: "12px", color: "#9AA0B0", fontWeight: 500, padding: "8px 8px 8px 0", borderBottom: "1px solid #EFEFEA" },
  td: { fontSize: "13px", color: "#374151", padding: "12px 8px 12px 0", borderBottom: "1px solid #F3F3EF" },
  presentBadge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#0F6E56", background: "#E1F5EE", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 },
  presentDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#0F6E56" },
};

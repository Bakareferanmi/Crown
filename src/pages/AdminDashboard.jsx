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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.crownIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18L2 8L7.5 12L12 5L16.5 12L22 8L21 18H3Z" fill="#E8A33D" />
            </svg>
          </div>
          <div>
            <p style={styles.wordmark}>Crown</p>
            <p style={styles.subwordmark}>Admin dashboard</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total staff</p>
          <p style={styles.statValue}>{staffList.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Active</p>
          <p style={{ ...styles.statValue, color: "#0F6E56" }}>{activeCount}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Records logged</p>
          <p style={styles.statValue}>{attendance.length}</p>
        </div>
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
        <h2 style={styles.cardTitle}>Attendance history</h2>
        {attendance.length === 0 && <p style={styles.emptyText}>No attendance recorded yet.</p>}
        {attendance.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Staff</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Clock in</th>
                <th style={styles.th}>Clock out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{staffName(r.staff_id)}</td>
                  <td style={styles.td}>{r.date}</td>
                  <td style={styles.td}>{r.clock_in || "-"}</td>
                  <td style={styles.td}>{r.clock_out || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', system-ui, sans-serif", padding: "24px 16px" },
  header: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center", maxWidth: "1000px", margin: "0 auto 20px" },
  brandRow: { display: "flex", alignItems: "center", gap: "10px" },
  crownIcon: { width: "32px", height: "32px", borderRadius: "9px", background: "rgba(232, 163, 61, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" },
  wordmark: { fontSize: "16px", fontWeight: 600, color: "#1A1D29", margin: 0 },
  subwordmark: { fontSize: "12px", color: "#9AA0B0", margin: "1px 0 0" },
  logoutButton: { fontSize: "13px", color: "#6B7280", background: "#fff", border: "1px solid #E5E5E1", borderRadius: "10px", padding: "8px 16px", cursor: "pointer" },
  statsRow: { display: "flex", flexWrap: "wrap", gap: "14px", maxWidth: "1000px", margin: "0 auto 20px" },
  statCard: { flex: "1 1 140px", background: "#fff", border: "1px solid #EFEFEA", borderRadius: "14px", padding: "16px 18px", boxShadow: "0 1px 2px rgba(20,20,20,0.03)" },
  statLabel: { fontSize: "12px", color: "#9AA0B0", margin: "0 0 4px" },
  statValue: { fontSize: "24px", fontWeight: 600, color: "#1A1D29", margin: 0, letterSpacing: "-0.01em" },
  grid: { display: "flex", flexWrap: "wrap", gap: "16px", maxWidth: "1000px", margin: "0 auto 16px" },
  card: { background: "#fff", border: "1px solid #EFEFEA", borderRadius: "16px", padding: "24px", maxWidth: "1000px", margin: "0 auto 16px", boxShadow: "0 1px 2px rgba(20,20,20,0.03)" },
  cardTitle: { fontSize: "15px", fontWeight: 600, color: "#1A1D29", margin: "0 0 18px" },
  input: { display: "block", width: "100%", padding: "11px 14px", marginBottom: "12px", fontSize: "14px", border: "1.5px solid #E5E5E1", borderRadius: "10px", background: "#FCFCFB", boxSizing: "border-box", outline: "none" },
  primaryButton: { width: "100%", padding: "12px", fontSize: "14px", fontWeight: 600, color: "#1A1D29", background: "#E8A33D", border: "none", borderRadius: "10px", cursor: "pointer" },
  error: { fontSize: "13px", color: "#C0392B", background: "#FCEBEB", borderRadius: "8px", padding: "8px 12px", margin: "-2px 0 12px" },
  emptyText: { fontSize: "13px", color: "#9AA0B0" },
  staffRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F3F3EF", gap: "10px", flexWrap: "wrap" },
  staffLeft: { display: "flex", alignItems: "center", gap: "12px" },
  miniAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#1A1D29", color: "#E8A33D", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  staffName: { fontSize: "14px", fontWeight: 500, color: "#1A1D29", margin: 0 },
  staffMeta: { fontSize: "12px", color: "#9AA0B0", margin: "2px 0 0" },
  staffActions: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  statusBadge: { fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px" },
  statusActive: { background: "#E1F5EE", color: "#0F6E56" },
  statusInactive: { background: "#F1EFE8", color: "#5F5E5A" },
  smallButton: { fontSize: "12px", padding: "6px 12px", border: "1px solid #E5E5E1", borderRadius: "8px", background: "#fff", cursor: "pointer" },
  smallButtonDanger: { fontSize: "12px", padding: "6px 12px", border: "1px solid #F0999B", borderRadius: "8px", background: "#fff", color: "#C0392B", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "12px", color: "#9AA0B0", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid #EFEFEA" },
  td: { fontSize: "13px", color: "#1A1D29", padding: "12px 0", borderBottom: "1px solid #F3F3EF" },
};

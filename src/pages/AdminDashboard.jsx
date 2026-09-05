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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.wordmark}>Crown</p>
          <p style={styles.subwordmark}>Admin dashboard</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
      </div>

      <div style={styles.grid}>
        <div style={{ ...styles.card, flex: "1 1 280px", margin: 0 }}>
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

        <div style={{ ...styles.card, flex: "2 1 320px", margin: 0 }}>
          <h2 style={styles.cardTitle}>Staff ({staffList.length})</h2>
          {staffList.length === 0 && <p style={styles.emptyText}>No staff added yet.</p>}
          {staffList.map((s) => (
            <div key={s.uid} style={styles.staffRow}>
              <div>
                <p style={styles.staffName}>{s.name}</p>
                <p style={styles.staffMeta}>{s.email} · {s.department}</p>
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
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "Inter, system-ui, sans-serif", padding: "24px 16px" },
  header: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "flex-start", maxWidth: "960px", margin: "0 auto 24px" },
  wordmark: { fontSize: "20px", fontWeight: 600, color: "#1A1D29", margin: 0 },
  subwordmark: { fontSize: "13px", color: "#6B7280", margin: "2px 0 0" },
  logoutButton: { fontSize: "13px", color: "#6B7280", background: "none", border: "1px solid #D8D8D3", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" },
  grid: { display: "flex", flexWrap: "wrap", gap: "20px", maxWidth: "960px", margin: "0 auto 20px" },
  card: { background: "#fff", border: "1px solid #E5E5E1", borderRadius: "12px", padding: "24px", maxWidth: "960px", margin: "0 auto 20px" },
  cardTitle: { fontSize: "16px", fontWeight: 600, color: "#1A1D29", margin: "0 0 16px" },
  input: { display: "block", width: "100%", padding: "10px 12px", marginBottom: "12px", fontSize: "14px", border: "1px solid #D8D8D3", borderRadius: "8px", boxSizing: "border-box" },
  primaryButton: { width: "100%", padding: "11px", fontSize: "14px", fontWeight: 600, color: "#1A1D29", background: "#E8A33D", border: "none", borderRadius: "8px", cursor: "pointer" },
  error: { fontSize: "13px", color: "#C0392B", margin: "-4px 0 12px" },
  emptyText: { fontSize: "13px", color: "#9AA0B0" },
  staffRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F0F0EC", gap: "10px", flexWrap: "wrap" },
  staffName: { fontSize: "14px", fontWeight: 500, color: "#1A1D29", margin: 0 },
  staffMeta: { fontSize: "12px", color: "#6B7280", margin: "2px 0 0" },
  staffActions: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  statusBadge: { fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px" },
  statusActive: { background: "#E1F5EE", color: "#0F6E56" },
  statusInactive: { background: "#F1EFE8", color: "#5F5E5A" },
  smallButton: { fontSize: "12px", padding: "5px 10px", border: "1px solid #D8D8D3", borderRadius: "6px", background: "none", cursor: "pointer" },
  smallButtonDanger: { fontSize: "12px", padding: "5px 10px", border: "1px solid #F0999B", borderRadius: "6px", background: "none", color: "#C0392B", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "12px", color: "#6B7280", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid #E5E5E1" },
  td: { fontSize: "13px", color: "#1A1D29", padding: "10px 0", borderBottom: "1px solid #F0F0EC" },
};

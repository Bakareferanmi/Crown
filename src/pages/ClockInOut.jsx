import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";

export default function ClockInOut() {
  const [now, setNow] = useState(new Date());
  const { currentUser, attendance, clockIn, clockOut, logout } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = () => new Date().toISOString().split("T")[0];
  const myRecords = attendance.filter((a) => a.staff_id === currentUser?.uid);
  const todayRecord = myRecords.find((a) => a.date === todayStr());
  const isClockedIn = todayRecord && !todayRecord.clock_out;

  const handleToggleClock = () => {
    try {
      if (isClockedIn) {
        clockOut();
      } else {
        clockIn();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const initials = currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?";
  const firstName = currentUser?.name?.split(" ")[0] || "there";

  const totalDays = myRecords.length;
  const presentThisMonth = myRecords.filter((r) => r.date.startsWith(todayStr().slice(0, 7))).length;

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
              <p style={styles.brandSub}>Staff Attendance Management</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.iconButton}>
              <Icon name="bell" size={20} color="#6B7280" />
              <span style={styles.notifDot} />
            </button>
            <div style={styles.avatarSmall}>{initials}</div>
            <button onClick={handleLogout} style={styles.chevronButton}>
              <Icon name="chevronDown" size={16} color="#6B7280" />
            </button>
          </div>
        </div>

        <h1 style={styles.greeting}>Good morning, {firstName} <span>👋</span></h1>
        <p style={styles.subGreeting}>Here's your attendance overview for today.</p>
        <div style={styles.dateRow}>
          <Icon name="calendar" size={16} color="#6B7280" />
          <span>{dateStr}</span>
        </div>

        <div style={styles.clockCard}>
          <div style={styles.clockCardLeft}>
            <div style={styles.statusRow}>
              <span style={{ ...styles.statusDot, background: isClockedIn ? "#4ADE80" : "#FCA5A5" }} />
              <span style={styles.statusText}>{isClockedIn ? "You're currently clocked in" : "You're not clocked in yet"}</span>
            </div>
            <p style={styles.currentTimeLabel}>Current Time</p>
            <p style={styles.currentTime}>{timeStr}</p>
            <p style={styles.currentDate}>{dateStr}</p>

            <button onClick={handleToggleClock} style={styles.clockButton}>
              <Icon name={isClockedIn ? "logout" : "login"} size={16} color="#2F6FED" />
              {isClockedIn ? "Clock Out" : "Clock In"}
            </button>
          </div>

          <div style={styles.clockCardRight}>
            <div style={styles.clockRingOuter}>
              <div style={styles.clockRingInner}>
                <Icon name="clockFace" size={28} color="#2F6FED" />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <StatCard icon="calendarCheck" iconBg="#E6F0FE" iconColor="#2F6FED" label="Attendance" value={totalDays} unit="Days" />
          <StatCard icon="users" iconBg="#E1F5EE" iconColor="#0F6E56" label="This Month" value={presentThisMonth} unit="Present" />
          <StatCard icon="clockHistory" iconBg="#F1E9FE" iconColor="#7F56D9" label="On Time" value="94%" unit="Rate" />
          <StatCard icon="star" iconBg="#FEF3E2" iconColor="#E8A33D" label="Longest Streak" value="12" unit="Days" />
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Recent Attendance</h2>
            <button style={styles.viewAllButton}>
              View All <Icon name="arrowRight" size={14} color="#2F6FED" />
            </button>
          </div>

          <div style={styles.tableScroll}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Clock In</th>
                  <th style={styles.th}>Clock Out</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRecords.length === 0 && (
                  <tr><td colSpan={4} style={styles.emptyCell}>No attendance recorded yet.</td></tr>
                )}
                {myRecords.slice().reverse().map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}>{r.date}</td>
                    <td style={styles.td}>{r.clock_in || "-"}</td>
                    <td style={styles.td}>{r.clock_out || "-"}</td>
                    <td style={styles.td}>
                      <span style={styles.presentBadge}>
                        <span style={styles.presentDot} /> Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <nav style={styles.bottomNav}>
        <NavItem icon="home" label="Home" active />
        <NavItem icon="clockHistory" label="Attendance" />
        <NavItem icon="history" label="History" />
        <NavItem icon="settings" label="Settings" />
      </nav>
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

function NavItem({ icon, label, active }) {
  return (
    <button style={styles.navItem}>
      <Icon name={icon} size={20} color={active ? "#2F6FED" : "#9AA0B0"} />
      <span style={{ ...styles.navLabel, color: active ? "#2F6FED" : "#9AA0B0" }}>{label}</span>
      {active && <span style={styles.navUnderline} />}
    </button>
  );
}

function Icon({ name, size = 20, color = "#000" }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
    case "clockFace":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
    case "bell":
      return <svg {...props}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>;
    case "chevronDown":
      return <svg {...props}><path d="M6 9l6 6 6-6" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
    case "calendarCheck":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4" /></svg>;
    case "users":
      return <svg {...props}><circle cx="9" cy="8" r="3" /><path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><circle cx="18" cy="9" r="2.5" /><path d="M16.5 21v-1a4 4 0 013-3.87" /></svg>;
    case "clockHistory":
      return <svg {...props}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 1.5M9 3h6" /></svg>;
    case "star":
      return <svg {...props} fill={color} stroke="none"><path d="M12 2l3 6.5 7 1-5 5 1.5 7-6.5-3.5-6.5 3.5 1.5-7-5-5 7-1z" /></svg>;
    case "arrowRight":
      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "login":
      return <svg {...props}><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>;
    case "logout":
      return <svg {...props}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>;
    case "home":
      return <svg {...props}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>;
    case "history":
      return <svg {...props}><path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5M12 7v5l3 3" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;
    default:
      return null;
  }
}

const styles = {
  page: { minHeight: "100vh", background: "#F0F3FA", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  container: { flex: 1, maxWidth: "480px", width: "100%", margin: "0 auto", padding: "20px 20px 100px", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  brandRow: { display: "flex", alignItems: "center", gap: "10px" },
  logoBox: { width: "40px", height: "40px", borderRadius: "12px", background: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandName: { fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 },
  brandSub: { fontSize: "11px", color: "#9AA0B0", margin: "1px 0 0" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  iconButton: { position: "relative", width: "36px", height: "36px", borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  notifDot: { position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" },
  avatarSmall: { width: "36px", height: "36px", borderRadius: "50%", background: "#1A1D29", color: "#fff", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" },
  chevronButton: { background: "none", border: "none", cursor: "pointer", display: "flex" },
  greeting: { fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 4px" },
  subGreeting: { fontSize: "13px", color: "#6B7280", margin: "0 0 10px" },
  dateRow: { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6B7280", marginBottom: "20px" },
  clockCard: { background: "linear-gradient(135deg, #3B7BFF 0%, #2F6FED 100%)", borderRadius: "20px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "16px" },
  clockCardLeft: { flex: "1 1 200px" },
  statusRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%" },
  statusText: { fontSize: "13px", color: "#EAF0FF" },
  currentTimeLabel: { fontSize: "12px", color: "#C7D8FF", margin: "0 0 4px" },
  currentTime: { fontSize: "34px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" },
  currentDate: { fontSize: "13px", color: "#C7D8FF", margin: "4px 0 20px" },
  clockButton: { display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#2F6FED", fontSize: "14px", fontWeight: 600, border: "none", borderRadius: "12px", padding: "12px 20px", cursor: "pointer" },
  clockCardRight: { display: "flex", alignItems: "center", justifyContent: "center" },
  clockRingOuter: { width: "88px", height: "88px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" },
  clockRingInner: { width: "56px", height: "56px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" },
  statCard: { background: "#fff", borderRadius: "16px", padding: "16px", border: "1px solid #EDEFF3" },
  statIconBox: { width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" },
  statLabel: { fontSize: "12px", color: "#9AA0B0", margin: "0 0 2px" },
  statValue: { fontSize: "22px", fontWeight: 700, color: "#111827", margin: 0 },
  statUnit: { fontSize: "12px", color: "#9AA0B0", margin: "2px 0 0" },
  tableCard: { background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid #EDEFF3" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  tableTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 },
  viewAllButton: { display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#2F6FED", background: "none", border: "none", cursor: "pointer", fontWeight: 500 },
  tableScroll: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "420px" },
  th: { textAlign: "left", fontSize: "11px", color: "#9AA0B0", fontWeight: 500, padding: "6px 8px 10px 0", borderBottom: "1px solid #F0F0EC" },
  td: { fontSize: "13px", color: "#374151", padding: "12px 8px 12px 0", borderBottom: "1px solid #F5F5F2" },
  emptyCell: { fontSize: "13px", color: "#9AA0B0", padding: "16px 0", textAlign: "center" },
  presentBadge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#0F6E56", background: "#E1F5EE", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 },
  presentDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#0F6E56" },
  bottomNav: { position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #EDEFF3", display: "flex", justifyContent: "space-around", padding: "10px 0 6px", maxWidth: "480px", width: "100%", margin: "0 auto" },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px 12px" },
  navLabel: { fontSize: "11px", fontWeight: 500 },
  navUnderline: { position: "absolute", bottom: "-6px", width: "20px", height: "2px", background: "#2F6FED", borderRadius: "2px" },
};

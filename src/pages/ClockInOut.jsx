import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineClock, HiOutlineBell, HiOutlineCalendar, HiOutlineArrowRight } from "react-icons/hi2";
import { HiOutlineCalendar as HiCalendarCheck, HiOutlineUserGroup, HiOutlineClock as HiClockHistory, HiOutlineStar, HiOutlineLogin, HiOutlineLogout, HiOutlineLogout as HiOutlineSignOut, HiOutlineHome, HiOutlineClipboardList, HiOutlineCog, HiOutlineOfficeBuilding, HiOutlineMail } from "react-icons/hi";

import { useDemo } from "../context/DemoContext";

export default function ClockInOut() {
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("home");
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

  const AttendanceTable = ({ rows }) => (
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
          {rows.length === 0 && (
            <tr><td colSpan={4} style={styles.emptyCell}>No attendance recorded yet.</td></tr>
          )}
          {rows.slice().reverse().map((r) => (
            <tr key={r.id}>
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
            <div>
              <p style={styles.brandName}>Crown</p>
              <p style={styles.brandSub}>Staff Attendance</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.iconButton} aria-label="Notifications">
              <HiOutlineBell size={19} color="#374151" />
              <span style={styles.notifDot} />
            </button>
            <div style={styles.avatarSmall}>{initials}</div>
          </div>
        </div>

        {activeTab === "home" && (
          <>
            <h1 style={styles.greeting}>Good morning, {firstName} <span>👋</span></h1>
            <p style={styles.subGreeting}>Here's your attendance overview for today.</p>
            <div style={styles.dateRow}>
              <HiOutlineCalendar size={15} color="#4B5563" />
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
                  {isClockedIn ? <HiOutlineLogout size={17} color="#2F6FED" /> : <HiOutlineLogin size={17} color="#2F6FED" />}
                  {isClockedIn ? "Clock Out" : "Clock In"}
                </button>
              </div>

              <div style={styles.clockCardRight}>
                <div style={styles.clockRingOuter}>
                  <div style={styles.clockRingInner}>
                    <HiOutlineClock size={26} color="#2F6FED" />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <StatCard icon={<HiCalendarCheck size={18} color="#1D4ED8" />} iconBg="#DCE9FE" label="Attendance" value={totalDays} unit="Days" />
              <StatCard icon={<HiOutlineUserGroup size={18} color="#0F766E" />} iconBg="#D4F1EA" label="This Month" value={presentThisMonth} unit="Present" />
              <StatCard icon={<HiClockHistory size={18} color="#6D28D9" />} iconBg="#E9DFFC" label="On Time" value="94%" unit="Rate" />
              <StatCard icon={<HiOutlineStar size={18} color="#B45309" />} iconBg="#FCEBD1" label="Longest Streak" value="12" unit="Days" />
            </div>

            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>Recent Attendance</h2>
                <button style={styles.viewAllButton} onClick={() => setActiveTab("history")}>
                  View All <HiOutlineArrowRight size={14} color="#2F6FED" />
                </button>
              </div>
              <AttendanceTable rows={myRecords.slice(-5)} />
            </div>
          </>
        )}

        {activeTab === "attendance" && (
          <>
            <h1 style={styles.greeting}>My attendance</h1>
            <p style={styles.subGreeting}>Clock in or out and track today's status.</p>

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
                  {isClockedIn ? <HiOutlineLogout size={17} color="#2F6FED" /> : <HiOutlineLogin size={17} color="#2F6FED" />}
                  {isClockedIn ? "Clock Out" : "Clock In"}
                </button>
              </div>
              <div style={styles.clockCardRight}>
                <div style={styles.clockRingOuter}>
                  <div style={styles.clockRingInner}>
                    <HiOutlineClock size={26} color="#2F6FED" />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.tableCard}>
              <h2 style={styles.tableTitle}>This month</h2>
              <AttendanceTable rows={myRecords} />
            </div>
          </>
        )}

        {activeTab === "history" && (
          <>
            <h1 style={styles.greeting}>Attendance history</h1>
            <p style={styles.subGreeting}>Your full clock-in and clock-out log.</p>

            <div style={styles.tableCard}>
              <AttendanceTable rows={myRecords} />
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h1 style={styles.greeting}>Settings</h1>
            <p style={styles.subGreeting}>Your account details.</p>

            <div style={styles.tableCard}>
              <div style={styles.settingsRow}>
                <div style={styles.avatarLarge}>{initials}</div>
                <div>
                  <p style={styles.staffNameLg}>{currentUser?.name}</p>
                  <p style={styles.staffMetaLg}>Staff</p>
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
                <HiOutlineSignOut size={16} /> Log out
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

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={styles.navItem}>
      <span style={{ color: active ? "#2F6FED" : "#6B7280" }}>{icon}</span>
      <span style={{ ...styles.navLabel, color: active ? "#2F6FED" : "#6B7280" }}>{label}</span>
      {active && <span style={styles.navUnderline} />}
    </button>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#EEF2FA", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  container: { flex: 1, maxWidth: "480px", width: "100%", margin: "0 auto", padding: "16px 16px 96px", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" },
  brandRow: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0 },
  logoBox: { width: "38px", height: "38px", borderRadius: "11px", background: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandName: { fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 },
  brandSub: { fontSize: "11px", color: "#6B7280", margin: "1px 0 0" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 },
  iconButton: { position: "relative", width: "36px", height: "36px", borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  notifDot: { position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" },
  avatarSmall: { width: "36px", height: "36px", borderRadius: "50%", background: "#1F2937", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  avatarLarge: { width: "52px", height: "52px", borderRadius: "50%", background: "#1F2937", color: "#fff", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  greeting: { fontSize: "20px", fontWeight: 700, color: "#111827", margin: "0 0 4px", lineHeight: 1.3 },
  subGreeting: { fontSize: "13px", color: "#4B5563", margin: "0 0 10px" },
  dateRow: { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#4B5563", marginBottom: "18px" },
  clockCard: { background: "linear-gradient(135deg, #3B7BFF 0%, #2559D6 100%)", borderRadius: "20px", padding: "22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "16px" },
  clockCardLeft: { flex: "1 1 200px", minWidth: 0 },
  statusRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  statusText: { fontSize: "13px", color: "#F0F5FF" },
  currentTimeLabel: { fontSize: "12px", color: "#C7D8FF", margin: "0 0 4px" },
  currentTime: { fontSize: "32px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" },
  currentDate: { fontSize: "13px", color: "#D6E3FF", margin: "4px 0 18px" },
  clockButton: { display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", color: "#1D4ED8", fontSize: "14px", fontWeight: 700, border: "none", borderRadius: "12px", padding: "12px 18px", cursor: "pointer" },
  clockCardRight: { display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  clockRingOuter: { width: "76px", height: "76px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" },
  clockRingInner: { width: "50px", height: "50px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" },
  statCard: { background: "#fff", borderRadius: "16px", padding: "14px", border: "1px solid #E5E7EB", minWidth: 0 },
  statIconBox: { width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" },
  statLabel: { fontSize: "12px", color: "#6B7280", margin: "0 0 2px" },
  statValue: { fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0 },
  statUnit: { fontSize: "12px", color: "#6B7280", margin: "2px 0 0" },
  tableCard: { background: "#fff", borderRadius: "16px", padding: "16px", border: "1px solid #E5E7EB", marginBottom: "16px" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" },
  tableTitle: { fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 12px" },
  viewAllButton: { display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#1D4ED8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 },
  tableScroll: { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "400px" },
  th: { textAlign: "left", fontSize: "11px", color: "#6B7280", fontWeight: 600, padding: "6px 8px 10px 0", borderBottom: "1px solid #E5E7EB" },
  td: { fontSize: "13px", color: "#1F2937", padding: "12px 8px 12px 0", borderBottom: "1px solid #F3F4F6" },
  emptyCell: { fontSize: "13px", color: "#6B7280", padding: "16px 0", textAlign: "center" },
  presentBadge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#0F766E", background: "#D4F1EA", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 },
  presentDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#0F766E" },
  staffNameLg: { fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 },
  staffMetaLg: { fontSize: "12px", color: "#6B7280", margin: "2px 0 0" },
  settingsRow: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" },
  settingsDetail: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151", padding: "10px 0", borderTop: "1px solid #F3F4F6" },
  dangerButton: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 18px", fontSize: "14px", fontWeight: 700, color: "#991B1B", background: "#FEE2E2", border: "none", borderRadius: "10px", cursor: "pointer", marginTop: "8px" },
  bottomNav: { position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-around", padding: "8px 0 calc(6px + env(safe-area-inset-bottom))", maxWidth: "480px", width: "100%", margin: "0 auto" },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px 10px" },
  navLabel: { fontSize: "11px", fontWeight: 600 },
  navUnderline: { position: "absolute", bottom: "-6px", width: "20px", height: "2px", background: "#2F6FED", borderRadius: "2px" },
};

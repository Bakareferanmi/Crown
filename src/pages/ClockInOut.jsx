import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";

export default function ClockInOut() {
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("neutral");
  const [now, setNow] = useState(new Date());
  const { currentUser, clockIn, clockOut, logout } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setStatus("");
    try {
      clockIn();
      setStatus("Clocked in");
      setStatusType("success");
    } catch (err) {
      setStatus(err.message);
      setStatusType("error");
    }
  };

  const handleClockOut = () => {
    setStatus("");
    try {
      clockOut();
      setStatus("Clocked out");
      setStatusType("success");
    } catch (err) {
      setStatus(err.message);
      setStatusType("error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  const initials = currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <div style={styles.brandRow}>
            <div style={styles.crownIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18L2 8L7.5 12L12 5L16.5 12L22 8L21 18H3Z" fill="#E8A33D" />
              </svg>
            </div>
            <span style={styles.wordmark}>Crown</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
        </div>

        <div style={styles.avatar}>{initials}</div>
        <p style={styles.greeting}>{currentUser?.name}</p>
        <p style={styles.department}>{currentUser?.department}</p>

        <div style={styles.timeBlock}>
          <p style={styles.time}>{timeStr}</p>
          <p style={styles.date}>{dateStr}</p>
        </div>

        <button onClick={handleClockIn} style={styles.primaryButton}>Clock in</button>
        <button onClick={handleClockOut} style={styles.secondaryButton}>Clock out</button>

        {status && (
          <p style={{ ...styles.status, ...(statusType === "success" ? styles.statusSuccess : statusType === "error" ? styles.statusError : {}) }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1A1D29 0%, #23273A 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#fff",
    borderRadius: "20px",
    padding: "28px 28px 32px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  crownIcon: {
    width: "24px",
    height: "24px",
    borderRadius: "7px",
    background: "rgba(232, 163, 61, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1A1D29",
  },
  logoutButton: {
    fontSize: "12px",
    color: "#9AA0B0",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#1A1D29",
    color: "#E8A33D",
    fontSize: "18px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  greeting: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#1A1D29",
    margin: 0,
  },
  department: {
    fontSize: "13px",
    color: "#9AA0B0",
    margin: "2px 0 24px",
  },
  timeBlock: {
    background: "#FCF6EC",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "22px",
  },
  time: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1A1D29",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  date: {
    fontSize: "13px",
    color: "#B08331",
    margin: "4px 0 0",
  },
  primaryButton: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1A1D29",
    background: "#E8A33D",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  secondaryButton: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1A1D29",
    background: "#F7F7F5",
    border: "1.5px solid #E5E5E1",
    borderRadius: "12px",
    cursor: "pointer",
  },
  status: {
    fontSize: "13px",
    color: "#9AA0B0",
    marginTop: "16px",
  },
  statusSuccess: {
    color: "#0F6E56",
  },
  statusError: {
    color: "#C0392B",
  },
};

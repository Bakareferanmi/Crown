import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";

export default function ClockInOut() {
  const [status, setStatus] = useState("");
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
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleClockOut = () => {
    setStatus("");
    try {
      clockOut();
      setStatus("Clocked out");
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.wordmark}>Crown</p>
        <p style={styles.greeting}>{currentUser?.name}</p>
        <p style={styles.time}>{timeStr}</p>
        <p style={styles.date}>{dateStr}</p>

        <button onClick={handleClockIn} style={styles.primaryButton}>Clock in</button>
        <button onClick={handleClockOut} style={styles.secondaryButton}>Clock out</button>

        {status && <p style={styles.status}>{status}</p>}

        <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif", padding: "24px" },
  card: { width: "100%", maxWidth: "360px", background: "#1A1D29", borderRadius: "16px", padding: "40px 32px", textAlign: "center", color: "#F7F7F5" },
  wordmark: { fontSize: "16px", fontWeight: 600, color: "#9AA0B0", margin: "0 0 4px" },
  greeting: { fontSize: "15px", color: "#F7F7F5", margin: "0 0 20px" },
  time: { fontSize: "48px", fontWeight: 600, color: "#E8A33D", margin: 0, letterSpacing: "-0.02em" },
  date: { fontSize: "14px", color: "#9AA0B0", margin: "8px 0 32px" },
  primaryButton: { width: "100%", padding: "14px", fontSize: "15px", fontWeight: 600, color: "#1A1D29", background: "#E8A33D", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" },
  secondaryButton: { width: "100%", padding: "14px", fontSize: "15px", fontWeight: 600, color: "#F7F7F5", background: "transparent", border: "1px solid #3A3E4D", borderRadius: "8px", cursor: "pointer", marginBottom: "20px" },
  status: { fontSize: "13px", color: "#9AA0B0", margin: "0 0 20px" },
  logoutButton: { fontSize: "13px", color: "#6B7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [now, setNow] = useState(new Date());
  const { login } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/clock");
    } catch (err) {
      setError(err.message);
    }
  };

  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? "#2F6FED" : "#E5E7EB",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(47,111,237,0.12)" : "none",
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logoBox}>
            <ClockIcon size={20} color="#fff" />
          </div>
          <div>
            <p style={styles.brandName}>Crown</p>
            <p style={styles.brandSub}>Staff Attendance Management</p>
          </div>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Log in to clock in and view your attendance.</p>

        <div style={styles.demoHint}>Demo: admin@crown.com / admin123 · staff@crown.com / staff123</div>

        <form onSubmit={handleLogin}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            required
            style={inputStyle("email")}
          />

          <label style={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            required
            style={inputStyle("password")}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Log in</button>
        </form>

        <p style={styles.footerTime}>Current time: {timeStr}</p>
      </div>
    </div>
  );
}

function ClockIcon({ size = 20, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F0F3FA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "20px",
    padding: "32px 28px",
    border: "1px solid #EDEFF3",
    boxShadow: "0 1px 2px rgba(20,20,20,0.03), 0 12px 32px rgba(20,20,20,0.06)",
  },
  brandRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" },
  logoBox: { width: "44px", height: "44px", borderRadius: "13px", background: "#2F6FED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandName: { fontSize: "17px", fontWeight: 700, color: "#111827", margin: 0 },
  brandSub: { fontSize: "12px", color: "#9AA0B0", margin: "1px 0 0" },
  heading: { fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 6px" },
  subheading: { fontSize: "13px", color: "#6B7280", margin: "0 0 14px" },
  demoHint: { fontSize: "12px", color: "#6B7280", background: "#F0F3FA", borderRadius: "10px", padding: "10px 12px", marginBottom: "22px" },
  label: { display: "block", fontSize: "13px", fontWeight: 500, color: "#111827", marginBottom: "6px" },
  input: { display: "block", width: "100%", padding: "11px 14px", marginBottom: "16px", fontSize: "15px", border: "1.5px solid #E5E7EB", borderRadius: "10px", background: "#FAFAFA", color: "#111827", boxSizing: "border-box", outline: "none", transition: "border-color 0.15s ease, box-shadow 0.15s ease" },
  error: { fontSize: "13px", color: "#B91C1C", background: "#FEECEC", borderRadius: "8px", padding: "8px 12px", margin: "-4px 0 16px" },
  button: { width: "100%", padding: "13px", fontSize: "15px", fontWeight: 600, color: "#fff", background: "#2F6FED", border: "none", borderRadius: "10px", cursor: "pointer" },
  footerTime: { fontSize: "12px", color: "#9AA0B0", textAlign: "center", margin: "20px 0 0" },
};

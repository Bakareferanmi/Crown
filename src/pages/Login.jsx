import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  const [focusedField, setFocusedField] = useState(null);
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
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? "#E8A33D" : "#E5E5E1",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(232, 163, 61, 0.15)" : "none",
  });

  return (
    <div style={styles.page}>
      <div style={styles.brandPanel}>
        <div style={styles.brandTop}>
          <div style={styles.crownIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18L2 8L7.5 12L12 5L16.5 12L22 8L21 18H3Z" fill="#E8A33D" />
            </svg>
          </div>
          <p style={styles.wordmark}>Crown</p>
        </div>

        <div>
          <h2 style={styles.heroLine}>Track time.<br />Build trust.</h2>
          <p style={styles.tagline}>Clock in, clock out, and keep every hour on record.</p>
        </div>

        <div style={styles.clockRow}>
          <span style={styles.clockTime}>{timeStr}</span>
          <span style={styles.clockDate}>{dateStr}</span>
        </div>
      </div>

      <div style={styles.formPanel}>
        <div style={styles.formCard}>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subheading}>Log in with the email and password your admin gave you.</p>

          <p style={styles.demoHint}>Demo: admin@crown.com / admin123 · staff@crown.com / staff123</p>

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
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, sans-serif",
    flexWrap: "wrap",
    background: "#F7F7F5",
  },
  brandPanel: {
    flex: "1 1 340px",
    background: "linear-gradient(160deg, #1A1D29 0%, #23273A 100%)",
    color: "#F7F7F5",
    padding: "44px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "320px",
  },
  brandTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  crownIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    background: "rgba(232, 163, 61, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: "17px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    margin: 0,
  },
  heroLine: {
    fontSize: "30px",
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
    margin: "0 0 12px",
  },
  tagline: {
    fontSize: "14px",
    color: "#9AA0B0",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "300px",
  },
  clockRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  clockTime: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#E8A33D",
  },
  clockDate: {
    fontSize: "13px",
    color: "#6B7280",
  },
  formPanel: {
    flex: "1 1 380px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  formCard: {
    width: "100%",
    maxWidth: "360px",
    background: "#fff",
    borderRadius: "16px",
    padding: "36px 32px",
    boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 12px 32px rgba(20,20,20,0.06)",
    border: "1px solid #EFEFEA",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#1A1D29",
    margin: "0 0 6px",
    letterSpacing: "-0.01em",
  },
  subheading: {
    fontSize: "14px",
    color: "#6B7280",
    margin: "0 0 14px",
    lineHeight: 1.5,
  },
  demoHint: {
    fontSize: "12px",
    color: "#9AA0B0",
    background: "#F7F7F5",
    borderRadius: "8px",
    padding: "8px 12px",
    margin: "0 0 22px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#1A1D29",
    marginBottom: "6px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "11px 14px",
    marginBottom: "16px",
    fontSize: "15px",
    border: "1.5px solid #E5E5E1",
    borderRadius: "10px",
    background: "#FCFCFB",
    color: "#1A1D29",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  error: {
    fontSize: "13px",
    color: "#C0392B",
    background: "#FCEBEB",
    borderRadius: "8px",
    padding: "8px 12px",
    margin: "-4px 0 16px",
  },
  button: {
    width: "100%",
    padding: "13px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1A1D29",
    background: "#E8A33D",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
};

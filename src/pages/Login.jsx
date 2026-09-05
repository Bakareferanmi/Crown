import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/clock");
    } catch (err) {
      setError("That email or password doesn't match our records.");
    }
    setLoading(false);
  };

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={styles.page}>
      <div style={styles.brandPanel}>
        <p style={styles.wordmark}>Crown</p>
        <div style={styles.clockBlock}>
          <p style={styles.clockTime}>{timeStr}</p>
          <p style={styles.clockDate}>{dateStr}</p>
        </div>
        <p style={styles.tagline}>Every clock-in, accounted for.</p>
      </div>

      <div style={styles.formPanel}>
        <div style={styles.formWrap}>
          <h1 style={styles.heading}>Log in</h1>
          <p style={styles.subheading}>Use the email and password your admin gave you.</p>

          <form onSubmit={handleLogin}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Logging in..." : "Log in"}
            </button>
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
    fontFamily: "Inter, system-ui, sans-serif",
    flexWrap: "wrap",
  },
  brandPanel: {
    flex: "1 1 320px",
    background: "#1A1D29",
    color: "#F7F7F5",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "260px",
  },
  wordmark: {
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  clockBlock: {
    margin: "40px 0",
  },
  clockTime: {
    fontSize: "56px",
    fontWeight: 600,
    color: "#E8A33D",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  clockDate: {
    fontSize: "15px",
    color: "#9AA0B0",
    margin: "8px 0 0",
  },
  tagline: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },
  formPanel: {
    flex: "1 1 360px",
    background: "#F7F7F5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  formWrap: {
    width: "100%",
    maxWidth: "340px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1A1D29",
    margin: "0 0 6px",
  },
  subheading: {
    fontSize: "14px",
    color: "#6B7280",
    margin: "0 0 28px",
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
    padding: "11px 12px",
    marginBottom: "18px",
    fontSize: "15px",
    border: "1px solid #D8D8D3",
    borderRadius: "8px",
    background: "#fff",
    color: "#1A1D29",
    boxSizing: "border-box",
  },
  error: {
    fontSize: "13px",
    color: "#C0392B",
    margin: "-8px 0 16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1A1D29",
    background: "#E8A33D",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

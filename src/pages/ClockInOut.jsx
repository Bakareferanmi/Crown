import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebaseClient";
import callApi from "../lib/api";

export default function ClockInOut() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClockIn = async () => {
    setLoading(true);
    setStatus("");
    try {
      await callApi("clock-in", "POST");
      setStatus("Clocked in successfully");
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    setStatus("");
    try {
      await callApi("clock-out", "POST");
      setStatus("Clocked out successfully");
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: 20, textAlign: "center" }}>
      <h2>Welcome</h2>
      <p>{new Date().toDateString()}</p>

      <button onClick={handleClockIn} disabled={loading} style={{ width: "100%", padding: 12, marginBottom: 10 }}>
        Clock In
      </button>
      <button onClick={handleClockOut} disabled={loading} style={{ width: "100%", padding: 12, marginBottom: 20 }}>
        Clock Out
      </button>

      {status && <p>{status}</p>}

      <button onClick={handleLogout} style={{ width: "100%", padding: 10, background: "none", border: "1px solid #ccc" }}>
        Log Out
      </button>
    </div>
  );
}

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebaseClient";
import callApi from "../lib/api";

export default function AdminDashboard() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadStaff = async () => {
    try {
      const data = await callApi("staff-list", "GET");
      setStaffList(data.staff);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await callApi("staff-create", "POST", form);
      setForm({ name: "", email: "", password: "", department: "" });
      await loadStaff();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Log Out</button>
      </div>

      <h3>Add Staff</h3>
      <form onSubmit={handleCreate} style={{ marginBottom: 30 }}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 chars)"
          value={form.password}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          Create Staff
        </button>
      </form>

      <h3>Staff List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Email</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Department</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s) => (
            <tr key={s.uid}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { auth, db } from "../lib/firebaseClient";
import callApi from "../lib/api";

export default function AdminDashboard() {
  const [staffList, setStaffList] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadStaff = async () => {
    try {
      const snap = await getDocs(collection(db, "staff"));
      setStaffList(snap.docs.map((d) => ({ uid: d.id, ...d.data() })).filter((s) => s.role === "staff"));
    } catch (err) {
      setError(err.message);
    }
  };

  const loadAttendance = async () => {
    try {
      const q = query(collection(db, "attendance"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setAttendance(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStaff();
    loadAttendance();
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

  const handleDeactivate = async (uid) => {
    if (!confirm("Deactivate this staff member?")) return;
    try {
      await updateDoc(doc(db, "staff", uid), { active: false });
      await loadStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (uid) => {
    if (!confirm("Permanently delete this staff member? This cannot be undone.")) return;
    try {
      await callApi("staff-delete", "POST", { uid });
      await loadStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const staffName = (uid) => staffList.find((s) => s.uid === uid)?.name || uid;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
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
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Email</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Dept</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Status</th>
            <th style={{ borderBottom: "1px solid #ccc" }}></th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s) => (
            <tr key={s.uid}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>
              <td>{s.active === false ? "Inactive" : "Active"}</td>
              <td>
                <button onClick={() => handleDeactivate(s.uid)} style={{ marginRight: 5 }}>
                  Deactivate
                </button>
                <button onClick={() => handleDelete(s.uid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Attendance History</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Staff</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Date</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Clock In</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Clock Out</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((r) => (
            <tr key={r.id}>
              <td>{staffName(r.staff_id)}</td>
              <td>{r.date}</td>
              <td>{r.clock_in?.seconds ? new Date(r.clock_in.seconds * 1000).toLocaleTimeString() : "-"}</td>
              <td>{r.clock_out?.seconds ? new Date(r.clock_out.seconds * 1000).toLocaleTimeString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

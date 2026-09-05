import { createContext, useContext, useState } from "react";

const DemoContext = createContext(null);

const DEMO_USERS = [
  { uid: "admin1", email: "admin@crown.com", password: "admin123", name: "Demo Admin", role: "admin", department: "Management", active: true },
  { uid: "staff1", email: "staff@crown.com", password: "staff123", name: "Chidi Okafor", role: "staff", department: "Sales", active: true },
];

const SEED_ATTENDANCE = [
  { id: "a1", staff_id: "staff1", date: "2026-09-04", clock_in: "09:02 AM", clock_out: "05:10 PM" },
  { id: "a2", staff_id: "staff1", date: "2026-09-05", clock_in: "08:55 AM", clock_out: "05:00 PM" },
];

export function DemoProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [staffList, setStaffList] = useState(DEMO_USERS.filter((u) => u.role === "staff"));
  const [attendance, setAttendance] = useState(SEED_ATTENDANCE);

  const login = (email, password) => {
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("That email or password doesn't match our records.");
    setCurrentUser(user);
    return user;
  };

  const logout = () => setCurrentUser(null);

  const todayStr = () => new Date().toISOString().split("T")[0];
  const nowStr = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const clockIn = () => {
    const existing = attendance.find((a) => a.staff_id === currentUser.uid && a.date === todayStr());
    if (existing) throw new Error("Already clocked in today");
    setAttendance([
      ...attendance,
      { id: `a${Date.now()}`, staff_id: currentUser.uid, date: todayStr(), clock_in: nowStr(), clock_out: null },
    ]);
  };

  const clockOut = () => {
    const existing = attendance.find((a) => a.staff_id === currentUser.uid && a.date === todayStr());
    if (!existing) throw new Error("No clock-in found for today");
    if (existing.clock_out) throw new Error("Already clocked out today");
    setAttendance(attendance.map((a) => (a.id === existing.id ? { ...a, clock_out: nowStr() } : a)));
  };

  const addStaff = ({ name, email, password, department }) => {
    const uid = `staff${Date.now()}`;
    setStaffList([...staffList, { uid, name, email, password, department, role: "staff", active: true }]);
  };

  const deactivateStaff = (uid) => {
    setStaffList(staffList.map((s) => (s.uid === uid ? { ...s, active: false } : s)));
  };

  const deleteStaff = (uid) => {
    setStaffList(staffList.filter((s) => s.uid !== uid));
  };

  return (
    <DemoContext.Provider
      value={{ currentUser, login, logout, staffList, attendance, clockIn, clockOut, addStaff, deactivateStaff, deleteStaff }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebaseClient";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const [status, setStatus] = useState("loading"); // loading | allowed | denied

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus("denied");
        return;
      }

      if (!requireAdmin) {
        setStatus("allowed");
        return;
      }

      const staffDoc = await getDoc(doc(db, "staff", user.uid));
      if (staffDoc.exists() && staffDoc.data().role === "admin") {
        setStatus("allowed");
      } else {
        setStatus("denied");
      }
    });

    return () => unsub();
  }, [requireAdmin]);

  if (status === "loading") return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;
  if (status === "denied") return <Navigate to="/" replace />;
  return children;
}

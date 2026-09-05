import { db, verifyStaff } from "./_firebaseAdmin.js";
import admin from "firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const uid = await verifyStaff(req);
    const today = new Date().toISOString().split("T")[0];

    const existing = await db
      .collection("attendance")
      .where("staff_id", "==", uid)
      .where("date", "==", today)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: "Already clocked in today" });
    }

    const docRef = await db.collection("attendance").add({
      staff_id: uid,
      date: today,
      clock_in: admin.firestore.FieldValue.serverTimestamp(),
      clock_out: null,
    });

    return res.status(200).json({ id: docRef.id, message: "Clocked in" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

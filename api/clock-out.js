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

    if (existing.empty) {
      return res.status(400).json({ error: "No clock-in found for today" });
    }

    const docSnap = existing.docs[0];

    if (docSnap.data().clock_out) {
      return res.status(400).json({ error: "Already clocked out today" });
    }

    await docSnap.ref.update({
      clock_out: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Clocked out" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

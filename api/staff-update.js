import { db, verifyAdmin } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyAdmin(req);

    const { uid, name, department, active } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (department !== undefined) updates.department = department;
    if (active !== undefined) updates.active = active;

    await db.collection("staff").doc(uid).update(updates);

    return res.status(200).json({ message: "Staff updated" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

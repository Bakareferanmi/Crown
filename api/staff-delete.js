import { auth, db, verifyAdmin } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyAdmin(req);

    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "uid is required" });
    }

    await auth.deleteUser(uid);
    await db.collection("staff").doc(uid).delete();

    return res.status(200).json({ message: "Staff deleted" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

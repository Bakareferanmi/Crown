import { auth, db, verifyAdmin } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyAdmin(req);

    const { name, email, password, department } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: "Invalid input. Password must be at least 8 characters." });
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection("staff").doc(userRecord.uid).set({
      name,
      email,
      department: department || "",
      role: "staff",
      active: true,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ uid: userRecord.uid, message: "Staff created" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

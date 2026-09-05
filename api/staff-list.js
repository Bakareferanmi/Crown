import { db, verifyAdmin } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyAdmin(req);

    const snapshot = await db.collection("staff").where("role", "==", "staff").get();
    const staff = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

    return res.status(200).json({ staff });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

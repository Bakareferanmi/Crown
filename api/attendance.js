import { db, verifyAdmin } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyAdmin(req);

    const { staff_id, start_date, end_date } = req.query;

    let query = db.collection("attendance");

    if (staff_id) {
      query = query.where("staff_id", "==", staff_id);
    }
    if (start_date) {
      query = query.where("date", ">=", start_date);
    }
    if (end_date) {
      query = query.where("date", "<=", end_date);
    }

    const snapshot = await query.orderBy("date", "desc").get();
    const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ records });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

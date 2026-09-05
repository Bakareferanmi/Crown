import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();

export async function verifyAdmin(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw new Error("No token provided");

  const decoded = await auth.verifyIdToken(token);
  const staffDoc = await db.collection("staff").doc(decoded.uid).get();

  if (!staffDoc.exists || staffDoc.data().role !== "admin") {
    throw new Error("Not authorized as admin");
  }

  return { uid: decoded.uid, ...staffDoc.data() };
}

export async function verifyStaff(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) throw new Error("No token provided");

  const decoded = await auth.verifyIdToken(token);
  return decoded.uid;
}

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const money = (n) => `${Number(n || 0).toLocaleString("ar-EG")} ج.م`;

const list = async (q) => (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));

export const getPatients = () => list(collection(db, "patients"));

export const getPatient = async (id) => {
  const snap = await getDoc(doc(db, "patients", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const findPatientByPhone = async (phone) => {
  const found = await list(query(collection(db, "patients"), where("phone", "==", phone)));
  return found[0] || null;
};

export const addPatient = async ({ name, age, phone, address }) => {
  const ref = await addDoc(collection(db, "patients"), {
    name: name.trim(),
    age: age ? Number(age) : null,
    phone: phone.trim(),
    address: address.trim(),
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const addVisit = (visit) =>
  addDoc(collection(db, "visits"), {
    ...visit,
    total: Number(visit.total) || 0,
    paid: Number(visit.paid) || 0,
    createdAt: serverTimestamp(),
  });

export const addPayment = (payment) =>
  addDoc(collection(db, "payments"), {
    ...payment,
    amount: Number(payment.amount) || 0,
    createdAt: serverTimestamp(),
  });

export const getVisits = (patientId) =>
  list(patientId ? query(collection(db, "visits"), where("patientId", "==", patientId)) : collection(db, "visits"));

export const getPayments = (patientId) =>
  list(patientId ? query(collection(db, "payments"), where("patientId", "==", patientId)) : collection(db, "payments"));

export const getVisitsOn = (date) => list(query(collection(db, "visits"), where("date", "==", date)));
export const getPaymentsOn = (date) => list(query(collection(db, "payments"), where("date", "==", date)));

// المتبقي على كل مريض = إجمالي الخدمات - المدفوع مع الخدمات - الدفعات اللاحقة
export const balancesByPatient = (visits, payments) => {
  const map = {};
  for (const v of visits) map[v.patientId] = (map[v.patientId] || 0) + v.total - v.paid;
  for (const p of payments) map[p.patientId] = (map[p.patientId] || 0) - p.amount;
  return map;
};

export const byNewest = (a, b) => (b.date || "").localeCompare(a.date || "") || (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);

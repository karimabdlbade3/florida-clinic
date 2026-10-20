import { DOCTORS, SERVICES } from "../config";

export const emptyVisit = () => ({ service: "", doctor: "", total: "", paid: "", notes: "" });

export default function VisitFields({ visit, setVisit }) {
  const set = (name, value) => {
    const next = { ...visit, [name]: value };
    if (name === "service") {
      const s = SERVICES.find((x) => x.name === value);
      if (s) next.total = String(s.price);
    }
    setVisit(next);
  };
  const remaining = (Number(visit.total) || 0) - (Number(visit.paid) || 0);

  return (
    <div className="grid">
      <label>الخدمة
        <select value={visit.service} onChange={(e) => set("service", e.target.value)} required>
          <option value="">اختر الخدمة</option>
          {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
      </label>
      <label>الطبيب
        <select value={visit.doctor} onChange={(e) => set("doctor", e.target.value)} required>
          <option value="">اختر الطبيب</option>
          {DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>
      <label>الإجمالي<input type="number" min="0" value={visit.total} onChange={(e) => set("total", e.target.value)} required /></label>
      <label>المدفوع<input type="number" min="0" value={visit.paid} onChange={(e) => set("paid", e.target.value)} /></label>
      <label>الباقي<input type="number" value={remaining} readOnly className={remaining > 0 ? "warn" : ""} /></label>
      <label className="span2">ملاحظات<input value={visit.notes} onChange={(e) => set("notes", e.target.value)} /></label>
    </div>
  );
}

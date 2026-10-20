import { useState } from "react";
import { useParams } from "react-router-dom";
import { addPayment, addVisit, byNewest, getPatient, getPayments, getVisits, money, today } from "../db";
import useLoad from "../components/useLoad";
import VisitFields, { emptyVisit } from "../components/VisitFields";

export default function PatientDetail() {
  const { id } = useParams();
  const { data, error, reload } = useLoad(async () => {
    const [patient, visits, payments] = await Promise.all([getPatient(id), getVisits(id), getPayments(id)]);
    return { patient, visits, payments };
  }, [id]);
  const [mode, setMode] = useState(null);
  const [visit, setVisit] = useState(emptyVisit());
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">جاري التحميل...</p>;
  const { patient, visits, payments } = data;
  if (!patient) return <p className="error">المريض مش موجود</p>;

  const billed = visits.reduce((s, v) => s + v.total, 0);
  const paid = visits.reduce((s, v) => s + v.paid, 0) + payments.reduce((s, p) => s + p.amount, 0);
  const balance = billed - paid;

  const history = [
    ...visits.map((v) => ({ ...v, kind: "visit" })),
    ...payments.map((p) => ({ ...p, kind: "payment" })),
  ].sort(byNewest);

  const save = async (e) => {
    e.preventDefault();
    setFormError("");
    const base = { patientId: id, patientName: patient.name, date: today() };
    if (mode === "visit" && Number(visit.paid) > Number(visit.total)) return setFormError("المدفوع أكبر من الإجمالي");
    if (mode === "payment" && Number(amount) > balance) return setFormError("المبلغ أكبر من المتبقي");
    setBusy(true);
    try {
      if (mode === "visit") await addVisit({ ...base, ...visit });
      else await addPayment({ ...base, amount });
      setMode(null);
      setVisit(emptyVisit());
      setAmount("");
      reload();
    } catch (err) {
      console.error(err);
      setFormError("حصل خطأ أثناء الحفظ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="card">
        <h2>{patient.name}</h2>
        <p className="muted">
          <span dir="ltr">{patient.phone}</span>
          {patient.age != null && <> · {patient.age} سنة</>}
          {patient.address && <> · {patient.address}</>}
        </p>
        <div className="stats">
          <div className="stat"><span>إجمالي الخدمات</span><strong>{money(billed)}</strong></div>
          <div className="stat"><span>المدفوع</span><strong>{money(paid)}</strong></div>
          <div className={`stat ${balance > 0 ? "warn" : ""}`}><span>المتبقي</span><strong>{money(balance)}</strong></div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => setMode("visit")}>+ خدمة جديدة</button>
          <button className="btn ghost" onClick={() => setMode("payment")} disabled={balance <= 0}>+ دفعة</button>
        </div>
      </div>

      {mode && (
        <form className="card" onSubmit={save}>
          <h3>{mode === "visit" ? "خدمة جديدة" : "تسجيل دفعة"}</h3>
          {mode === "visit" ? (
            <VisitFields visit={visit} setVisit={setVisit} />
          ) : (
            <label className="inline">المبلغ<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
          )}
          {formError && <p className="error">{formError}</p>}
          <div className="row">
            <button className="btn" disabled={busy}>{busy ? "جاري الحفظ..." : "حفظ"}</button>
            <button type="button" className="btn ghost" onClick={() => setMode(null)}>إلغاء</button>
          </div>
        </form>
      )}

      <div className="card">
        <h3>السجل</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>التاريخ</th><th>البيان</th><th>الطبيب</th><th>الإجمالي</th><th>المدفوع</th></tr></thead>
            <tbody>
              {history.map((h) => h.kind === "visit" ? (
                <tr key={h.id}>
                  <td>{h.date}</td>
                  <td>{h.service}{h.notes && <div className="muted small">{h.notes}</div>}</td>
                  <td>{h.doctor}</td>
                  <td>{money(h.total)}</td>
                  <td>{money(h.paid)}</td>
                </tr>
              ) : (
                <tr key={h.id} className="payment">
                  <td>{h.date}</td><td>دفعة</td><td>-</td><td>-</td><td>{money(h.amount)}</td>
                </tr>
              ))}
              {!history.length && <tr><td colSpan="5" className="muted">مفيش سجل لسه</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

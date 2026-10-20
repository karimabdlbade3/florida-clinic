import { useState } from "react";
import { byNewest, getPaymentsOn, getVisitsOn, money, today } from "../db";
import { DOCTORS } from "../config";
import useLoad from "./useLoad";

export default function DailyReport() {
  const [date, setDate] = useState(today());
  const { data, error } = useLoad(async () => {
    const [visits, payments] = await Promise.all([getVisitsOn(date), getPaymentsOn(date)]);
    return { visits: visits.sort(byNewest), payments };
  }, [date]);

  const header = (
    <div className="row between no-print">
      <label className="inline">اليوم<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <button className="btn ghost" onClick={() => window.print()}>طباعة</button>
    </div>
  );

  if (error) return <div className="card">{header}<p className="error">{error}</p></div>;
  if (!data) return <div className="card">{header}<p className="muted">جاري التحميل...</p></div>;

  const { visits, payments } = data;
  const sum = (arr, k) => arr.reduce((s, x) => s + x[k], 0);
  const doctorNames = [...new Set([...DOCTORS, ...visits.map((v) => v.doctor)])];
  const perDoctor = doctorNames
    .map((d) => {
      const vs = visits.filter((v) => v.doctor === d);
      return { doctor: d, count: vs.length, total: sum(vs, "total"), paid: sum(vs, "paid") };
    })
    .filter((r) => r.count);

  return (
    <div className="card">
      {header}
      <h2>تقرير يوم {date}</h2>
      <div className="stats">
        <div className="stat"><span>عدد الحالات</span><strong>{visits.length}</strong></div>
        <div className="stat"><span>قيمة الخدمات</span><strong>{money(sum(visits, "total"))}</strong></div>
        <div className="stat"><span>محصل من الخدمات</span><strong>{money(sum(visits, "paid"))}</strong></div>
        <div className="stat"><span>دفعات متأخرة</span><strong>{money(sum(payments, "amount"))}</strong></div>
        <div className="stat ok"><span>إجمالي الخزنة</span><strong>{money(sum(visits, "paid") + sum(payments, "amount"))}</strong></div>
      </div>

      <h3>حسب الطبيب</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>الطبيب</th><th>الحالات</th><th>قيمة الخدمات</th><th>المحصل</th></tr></thead>
          <tbody>
            {perDoctor.map((r) => (
              <tr key={r.doctor}><td>{r.doctor}</td><td>{r.count}</td><td>{money(r.total)}</td><td>{money(r.paid)}</td></tr>
            ))}
            {!perDoctor.length && <tr><td colSpan="4" className="muted">مفيش حالات</td></tr>}
          </tbody>
        </table>
      </div>

      <h3>الحالات</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>المريض</th><th>الخدمة</th><th>الطبيب</th><th>الإجمالي</th><th>المدفوع</th><th>الباقي</th></tr></thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td>{v.patientName}</td><td>{v.service}</td><td>{v.doctor}</td>
                <td>{money(v.total)}</td><td>{money(v.paid)}</td>
                <td className={v.total - v.paid > 0 ? "warn" : ""}>{money(v.total - v.paid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length > 0 && (
        <>
          <h3>دفعات على حسابات قديمة</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>المريض</th><th>المبلغ</th></tr></thead>
              <tbody>{payments.map((p) => <tr key={p.id}><td>{p.patientName}</td><td>{money(p.amount)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

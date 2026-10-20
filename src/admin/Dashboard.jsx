import { Link } from "react-router-dom";
import { balancesByPatient, getPayments, getVisits, money, today } from "../db";
import useLoad from "./useLoad";

export default function Dashboard() {
  const { data, error } = useLoad(async () => {
    const [visits, payments] = await Promise.all([getVisits(), getPayments()]);
    const d = today();
    const month = d.slice(0, 7);
    const todayVisits = visits.filter((v) => v.date === d);
    const collected = (date) =>
      visits.filter((v) => date(v.date)).reduce((s, v) => s + v.paid, 0) +
      payments.filter((p) => date(p.date)).reduce((s, p) => s + p.amount, 0);
    const balances = Object.values(balancesByPatient(visits, payments)).filter((b) => b > 0);
    return {
      todayCount: todayVisits.length,
      todayCollected: collected((x) => x === d),
      monthCollected: collected((x) => x?.startsWith(month)),
      outstanding: balances.reduce((s, b) => s + b, 0),
      debtors: balances.length,
    };
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">جاري التحميل...</p>;

  return (
    <>
      <div className="stats">
        <div className="stat"><span>حالات النهارده</span><strong>{data.todayCount}</strong></div>
        <div className="stat"><span>محصل النهارده</span><strong>{money(data.todayCollected)}</strong></div>
        <div className="stat"><span>محصل الشهر</span><strong>{money(data.monthCollected)}</strong></div>
        <div className="stat warn"><span>فلوس برا ({data.debtors} مريض)</span><strong>{money(data.outstanding)}</strong></div>
      </div>
      <div className="row">
        <Link className="btn" to="/admin/register">+ تسجيل مريض</Link>
        <Link className="btn ghost" to="/admin/patients">المرضى</Link>
        <Link className="btn ghost" to="/admin/report">تقرير اليوم</Link>
      </div>
    </>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { balancesByPatient, getPatients, getPayments, getVisits, money } from "../db";
import useLoad from "../components/useLoad";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [onlyDebt, setOnlyDebt] = useState(false);
  const { data, error } = useLoad(async () => {
    const [patients, visits, payments] = await Promise.all([getPatients(), getVisits(), getPayments()]);
    return { patients, balances: balancesByPatient(visits, payments) };
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const s = search.trim();
    return data.patients
      .map((p) => ({ ...p, balance: data.balances[p.id] || 0 }))
      .filter((p) => !s || p.name.includes(s) || p.phone.includes(s))
      .filter((p) => !onlyDebt || p.balance > 0)
      .sort((a, b) => a.name.localeCompare(b.name, "ar"));
  }, [data, search, onlyDebt]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">جاري التحميل...</p>;

  return (
    <div className="card">
      <div className="row between">
        <h2>المرضى ({rows.length})</h2>
        <Link className="btn" to="/register">+ مريض جديد</Link>
      </div>
      <div className="row">
        <input placeholder="ابحث بالاسم أو الموبايل" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="check"><input type="checkbox" checked={onlyDebt} onChange={(e) => setOnlyDebt(e.target.checked)} /> عليهم فلوس بس</label>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>الاسم</th><th>الموبايل</th><th>السن</th><th>المتبقي</th></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/patients/${p.id}`}>{p.name}</Link></td>
                <td dir="ltr">{p.phone}</td>
                <td>{p.age ?? "-"}</td>
                <td className={p.balance > 0 ? "warn" : ""}>{money(p.balance)}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="4" className="muted">مفيش نتايج</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

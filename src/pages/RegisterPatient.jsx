import { useState } from "react";
import { Link } from "react-router-dom";
import { addPatient, addVisit, findPatientByPhone, today } from "../db";
import VisitFields, { emptyVisit } from "../components/VisitFields";

const emptyPatient = () => ({ name: "", age: "", phone: "", address: "" });

export default function RegisterPatient() {
  const [patient, setPatient] = useState(emptyPatient());
  const [existing, setExisting] = useState(null);
  // أفراد العيلة ممكن يشتركوا في نفس الرقم، فبنسمح بملف جديد بنفس الموبايل
  const [forceNew, setForceNew] = useState(false);
  const [visit, setVisit] = useState(emptyVisit());
  const [date, setDate] = useState(today());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const setField = (e) => {
    if (e.target.name === "phone") setForceNew(false);
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const checkPhone = async () => {
    const phone = patient.phone.trim();
    if (phone.length < 8 || forceNew) return setExisting(null);
    setExisting(await findPatientByPhone(phone));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Number(visit.paid) > Number(visit.total)) {
      setMsg({ type: "error", text: "المدفوع أكبر من الإجمالي" });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      // نتأكد تاني وقت الحفظ عشان مايتكررش نفس المريض بملفين
      const match = existing || (forceNew ? null : await findPatientByPhone(patient.phone.trim()));
      if (match && !existing) {
        setExisting(match);
        setMsg({ type: "error", text: "الرقم ده متسجل لمريض تاني، راجع وبعدين اضغط تسجيل" });
        return;
      }
      const patientId = match ? match.id : await addPatient(patient);
      const patientName = match ? match.name : patient.name.trim();
      await addVisit({ ...visit, patientId, patientName, date });
      setMsg({ type: "ok", text: `تم تسجيل ${patientName}`, patientId });
      setPatient(emptyPatient());
      setExisting(null);
      setForceNew(false);
      setVisit(emptyVisit());
      setDate(today());
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "حصل خطأ أثناء الحفظ، جرب تاني" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>تسجيل مريض + خدمة</h2>

      <h3>بيانات المريض</h3>
      <div className="grid">
        <label>رقم الموبايل
          <input name="phone" inputMode="tel" value={patient.phone} onChange={setField} onBlur={checkPhone} required />
        </label>
        {existing ? (
          <div className="notice span2">
            المريض مسجل قبل كده: <strong>{existing.name}</strong>. الخدمة هتتسجل على ملفه.{" "}
            <button type="button" className="link" onClick={() => { setExisting(null); setForceNew(true); }}>ده مريض تاني</button>
          </div>
        ) : (
          <>
            <label>الاسم<input name="name" value={patient.name} onChange={setField} required /></label>
            <label>السن<input name="age" type="number" min="0" value={patient.age} onChange={setField} /></label>
            <label>العنوان<input name="address" value={patient.address} onChange={setField} /></label>
          </>
        )}
      </div>

      <h3>الخدمة</h3>
      <label className="inline">التاريخ<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
      <VisitFields visit={visit} setVisit={setVisit} />

      {msg && (
        <p className={msg.type === "ok" ? "success" : "error"}>
          {msg.text}{msg.patientId && <> · <Link to={`/patients/${msg.patientId}`}>فتح ملف المريض</Link></>}
        </p>
      )}
      <button className="btn" disabled={busy}>{busy ? "جاري الحفظ..." : "تسجيل"}</button>
    </form>
  );
}

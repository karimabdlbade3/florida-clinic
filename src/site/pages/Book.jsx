import { useState } from "react";
import { PageBanner } from "../Layout";
import { BRANCHES, SERVICES, whatsappLink } from "../content";

// الحجز بيتبعت رسالة واتساب جاهزة للعيادة، من غير ما نخزن بيانات المريض على الموقع
export default function Book() {
  const [f, setF] = useState({ name: "", phone: "", branch: BRANCHES[0].name, service: "", day: "", notes: "" });
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const lines = [
      "طلب حجز ميعاد",
      `الاسم: ${f.name}`,
      `الموبايل: ${f.phone}`,
      `الفرع: ${f.branch}`,
      f.service && `الخدمة: ${f.service}`,
      f.day && `اليوم المناسب: ${f.day}`,
      f.notes && `ملاحظات: ${f.notes}`,
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
  };

  return (
    <>
      <PageBanner title="احجز ميعادك" />
      <section className="s-section white">
        <form className="s-form" onSubmit={submit}>
          <label>الاسم<input name="name" value={f.name} onChange={set} required /></label>
          <label>رقم الموبايل<input name="phone" inputMode="tel" value={f.phone} onChange={set} required /></label>
          <label>الفرع
            <select name="branch" value={f.branch} onChange={set}>
              {BRANCHES.map((b) => <option key={b.name}>{b.name}</option>)}
            </select>
          </label>
          <label>الخدمة
            <select name="service" value={f.service} onChange={set}>
              <option value="">مش متأكد / كشف</option>
              {SERVICES.map((s) => <option key={s.name}>{s.name}</option>)}
            </select>
          </label>
          <label>اليوم المناسب<input name="day" type="date" value={f.day} onChange={set} /></label>
          <label className="full">ملاحظات<textarea name="notes" rows="3" value={f.notes} onChange={set} /></label>
          <button className="s-btn gold full">ابعت الحجز على واتساب</button>
          <p className="s-note full">هيفتحلك واتساب برسالة جاهزة، اضغط إرسال وهنرد عليك نأكد الميعاد.</p>
        </form>
      </section>
    </>
  );
}

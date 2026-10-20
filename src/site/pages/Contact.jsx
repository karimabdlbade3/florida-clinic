import { CtaBand, PageBanner } from "../Layout";
import Img from "../Img";
import { BRANCHES, SITE, mapLink, whatsappLink } from "../content";
import { Mail, Phone, Pin, Whatsapp } from "../Icons";

export default function Contact() {
  return (
    <>
      <PageBanner title="تواصل معنا" />
      <section className="s-section white">
        <div className="s-contact">
          <div>
            <h2 className="s-subtitle">بيانات الاتصال</h2>
            <ul className="s-contact-list">
              <li><Whatsapp /><div><span>واتساب</span><a href={whatsappLink()} target="_blank" rel="noreferrer" dir="ltr">{SITE.whatsapp}</a></div></li>
              <li><Phone /><div><span>اتصال</span>{SITE.phones.map((p) => <a key={p} href={`tel:${p}`} dir="ltr">{p}</a>)}</div></li>
              <li><Mail /><div><span>البريد الإلكتروني</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div></li>
              {BRANCHES.map((b) => (
                <li key={b.name}><Pin /><div><span>{b.name}</span><a href={mapLink(b.address)} target="_blank" rel="noreferrer">{b.address}</a></div></li>
              ))}
            </ul>
          </div>
          <Img src="/images/contact.jpg" alt="خدمة العملاء" className="s-contact-img" fallback={<Phone width="64" height="64" />} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

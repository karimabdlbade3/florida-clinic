import { Link } from "react-router-dom";
import Logo from "./Logo";
import Img from "./Img";
import { ABOUT, CASES, REVIEWS, SERVICES, SITE, TEAM, whatsappLink } from "./content";
import { Facebook, Instagram, Tooth, Whatsapp } from "./Icons";

export function ServicesRing() {
  const half = Math.ceil(SERVICES.length / 2);
  const col = (items, offset) => (
    <div className="s-ring-col">
      {items.map((s, i) => (
        <Link key={s.name} to="/services" className={`s-pill ${(i + offset) % 2 ? "dark" : "gold"}`}>{s.name}</Link>
      ))}
    </div>
  );
  return (
    <section className="s-section">
      <h2 className="s-title">خدماتنا</h2>
      <div className="s-ring">
        {col(SERVICES.slice(0, half), 0)}
        <div className="s-ring-tooth"><Tooth width="140" height="140" strokeWidth="0.9" /></div>
        {col(SERVICES.slice(half), 1)}
      </div>
    </section>
  );
}

export function AboutBlock() {
  return (
    <section className="s-about">
      <div className="s-about-text">
        <h2>عن عيادات فلوريدا</h2>
        <p>{ABOUT}</p>
        <a className="s-btn gold" href={whatsappLink("أهلاً، عايز أحجز ميعاد")} target="_blank" rel="noreferrer">Better Call Florida</a>
      </div>
      <div className="s-about-logo">
        <div className="s-about-badge"><Logo /></div>
        <div className="s-socials">
          <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="فيسبوك"><Facebook /></a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="انستجرام"><Instagram /></a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="واتساب"><Whatsapp /></a>
        </div>
      </div>
    </section>
  );
}

export function CasesGrid({ limit }) {
  const items = limit ? CASES.slice(0, limit) : CASES;
  return (
    <div className="s-cases">
      {items.map((file, i) => (
        <Img
          key={file}
          src={`/images/cases/${file}`}
          alt={`حالة قبل وبعد ${i + 1}`}
          className="s-case"
          fallback={<><span>قبل</span><span>بعد</span></>}
        />
      ))}
    </div>
  );
}

export function ReviewsList({ limit }) {
  const items = limit ? REVIEWS.slice(0, limit) : REVIEWS;
  if (!items.length) {
    return (
      <div className="s-reviews-empty">
        <p>اقرا تجارب عملائنا الحقيقية على صفحتنا</p>
        <a className="s-btn dark" href={SITE.facebook} target="_blank" rel="noreferrer">تقييمات فيسبوك</a>
      </div>
    );
  }
  return (
    <div className="s-reviews">
      {items.map((r, i) => (
        <blockquote key={i} className="s-review">
          <p>{r.text}</p>
          <cite>{r.name}</cite>
        </blockquote>
      ))}
    </div>
  );
}

export function TeamGrid() {
  return (
    <div className="s-team">
      {TEAM.map((m) => (
        <div key={m.name} className="s-member">
          <Img
            src={`/images/team/${m.photo}`}
            alt={m.name}
            className="s-avatar"
            fallback={m.name.split(" ").slice(-2).map((w) => w[0]).join(" ")}
          />
          <h3>{m.name}</h3>
          <p>{m.role}</p>
        </div>
      ))}
    </div>
  );
}

export function More({ to }) {
  return <div className="s-center"><Link className="s-btn gold small" to={to}>المزيد</Link></div>;
}

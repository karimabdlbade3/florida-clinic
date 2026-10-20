import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { BRANCHES, SERVICES, SITE, STATS, mapLink, whatsappLink } from "./content";
import { Cert, Chair, Chevron, Facebook, Instagram, Menu, Phone, Pin, Success, Whatsapp } from "./Icons";

const NAV = [
  ["/", "الرئيسية"],
  ["/about", "من نحن"],
  ["/book", "احجز"],
  ["/services", "خدماتنا"],
  ["/team", "فريق العمل"],
  ["/before-after", "قبل وبعد"],
  ["/reviews", "آراء العملاء"],
  ["/contact", "تواصل معنا"],
];

const STAT_ICONS = { cert: Cert, chair: Chair, success: Success };

export function PageBanner({ title }) {
  return (
    <section className="s-banner">
      <h1>{title}</h1>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="s-cta">
      <div className="s-stats">
        {STATS.map((s) => {
          const Icon = STAT_ICONS[s.icon];
          return (
            <div key={s.label} className="s-stat">
              <Icon width="48" height="48" />
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
      <p>نحب نقولك هتفضل خايف من دكاترة الأسنان طول ما أنت مجربتش علاج أسنانك في عيادات فلوريدا</p>
      <a className="s-btn gold" href={whatsappLink("أهلاً، عايز أحجز ميعاد")} target="_blank" rel="noreferrer">Better Call Florida</a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="s-footer">
      <div className="s-footer-grid">
        <div className="s-footer-brand"><Logo light /></div>
        <div>
          <h4>خدماتنا</h4>
          <ul className="s-footer-list">
            {SERVICES.map((s) => (
              <li key={s.name}><Link to="/services"><Chevron width="14" height="14" />{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>تواصل معنا</h4>
          <ul className="s-footer-list">
            {BRANCHES.map((b) => (
              <li key={b.name}><a href={mapLink(b.address)} target="_blank" rel="noreferrer"><Pin width="16" height="16" />{b.address}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>&nbsp;</h4>
          <ul className="s-footer-list">
            <li><a href={`tel:${SITE.phones[0]}`}><Phone width="16" height="16" /><span dir="ltr">{SITE.phones.join(" / ")}</span></a></li>
            <li><a href={whatsappLink()} target="_blank" rel="noreferrer"><Whatsapp width="16" height="16" /><span dir="ltr">{SITE.whatsapp}</span></a></li>
            <li><a href={SITE.facebook} target="_blank" rel="noreferrer"><Facebook width="16" height="16" />{SITE.facebookName}</a></li>
            <li><a href={SITE.instagram} target="_blank" rel="noreferrer"><Instagram width="16" height="16" />{SITE.instagramName}</a></li>
          </ul>
        </div>
      </div>
      <div className="s-copy" dir="ltr">
        All Rights Reserved Florida Dental Clinics, Developed and Designed by Karim AbdeLbadea
      </div>
    </footer>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site">
      <header className="s-header">
        <Link to="/" aria-label="الرئيسية"><Logo /></Link>
        <button className="s-menu-btn" onClick={() => setOpen(!open)} aria-label="القائمة" aria-expanded={open}>
          <Menu />
        </button>
        <nav className={open ? "open" : ""}>
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
      <a className="s-wa-float" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="واتساب">
        <Whatsapp width="28" height="28" />
      </a>
    </div>
  );
}

import { CtaBand, PageBanner } from "../Layout";
import { SERVICES } from "../content";
import { Tooth } from "../Icons";

export default function Services() {
  return (
    <>
      <PageBanner title="خدماتنا" />
      <section className="s-section white">
        <div className="s-service-grid">
          {SERVICES.map((s) => (
            <div key={s.name} className="s-service">
              <Tooth width="36" height="36" />
              <h3>{s.name}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

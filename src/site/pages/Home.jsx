import Img from "../Img";
import { CtaBand } from "../Layout";
import { AboutBlock, CasesGrid, More, ReviewsList, ServicesRing } from "../Sections";
import { REVIEWS, SITE } from "../content";

export default function Home() {
  return (
    <>
      <section className="s-hero">
        <Img src="/images/hero.jpg" alt="ابتسامة" className="s-hero-img" fallback={null} />
        <div className="s-hero-text">
          <h1><span className="gold">{SITE.name.split(" ")[0]}</span> {SITE.name.split(" ").slice(1).join(" ")}</h1>
          <p>{SITE.tagline}</p>
        </div>
      </section>
      <ServicesRing />
      <AboutBlock />
      <section className="s-section">
        <h2 className="s-title small">حالات قبل وبعد</h2>
        <CasesGrid limit={3} />
        <More to="/before-after" />
      </section>
      <section className="s-section white">
        <h2 className="s-title">آراء العملاء</h2>
        <ReviewsList limit={3} />
        {REVIEWS.length > 3 && <More to="/reviews" />}
      </section>
      <CtaBand />
    </>
  );
}

import { CtaBand, PageBanner } from "../Layout";
import { AboutBlock, TeamGrid } from "../Sections";

export default function About() {
  return (
    <>
      <PageBanner title="من نحن" />
      <AboutBlock />
      <section className="s-section white"><h2 className="s-title">فريقنا</h2><TeamGrid /></section>
      <CtaBand />
    </>
  );
}

import { CtaBand, PageBanner } from "../Layout";
import { TeamGrid } from "../Sections";

export default function Team() {
  return (
    <>
      <PageBanner title="فريق عمل فلوريدا" />
      <section className="s-section white"><TeamGrid /></section>
      <CtaBand />
    </>
  );
}

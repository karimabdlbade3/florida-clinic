import { CtaBand, PageBanner } from "../Layout";
import { CasesGrid } from "../Sections";

export default function BeforeAfter() {
  return (
    <>
      <PageBanner title="قبل وبعد" />
      <section className="s-section white"><CasesGrid /></section>
      <CtaBand />
    </>
  );
}

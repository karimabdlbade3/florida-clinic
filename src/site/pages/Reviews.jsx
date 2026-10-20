import { CtaBand, PageBanner } from "../Layout";
import { ReviewsList } from "../Sections";

export default function Reviews() {
  return (
    <>
      <PageBanner title="آراء العملاء" />
      <section className="s-section white"><ReviewsList /></section>
      <CtaBand />
    </>
  );
}

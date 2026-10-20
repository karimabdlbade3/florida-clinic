import { Tooth } from "./Icons";

export default function Logo({ light = false }) {
  return (
    <span className={`s-logo ${light ? "light" : ""}`}>
      <span className="s-logo-mark"><Tooth width="22" height="22" /></span>
      <span className="s-logo-text">
        <strong>FLORIDA</strong>
        <small>Dental Clinics</small>
      </span>
    </span>
  );
}

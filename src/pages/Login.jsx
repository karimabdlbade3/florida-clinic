import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { CLINIC_NAME } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError("الإيميل أو كلمة السر غلط");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center">
      <form className="card narrow" onSubmit={submit}>
        <h2>{CLINIC_NAME}</h2>
        <p className="muted">سجل دخول عشان تكمل</p>
        <label>الإيميل<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>كلمة السر<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "..." : "دخول"}</button>
      </form>
    </div>
  );
}

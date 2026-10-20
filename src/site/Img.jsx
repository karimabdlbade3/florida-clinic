import { useState } from "react";

// صورة مع بديل لطيف لو الملف لسه مش موجود في public/images
export default function Img({ src, alt, className = "", fallback }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return <div className={`s-img-fallback ${className}`} role="img" aria-label={alt}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

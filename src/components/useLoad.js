import { useCallback, useEffect, useState } from "react";

// تحميل بيانات من Firestore مع حالة التحميل والخطأ وإمكانية إعادة التحميل
export default function useLoad(fn, deps) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fn, deps);

  const reload = useCallback(() => {
    setError(null);
    load().then(setData).catch((e) => {
      console.error(e);
      setError("تعذر تحميل البيانات");
    });
  }, [load]);

  useEffect(reload, [reload]);
  return { data, error, reload };
}

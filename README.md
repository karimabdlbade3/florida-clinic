# عيادة فلوريدا للأسنان - فرع كفور

سيستم داخلي للعيادة: تسجيل المرضى والخدمات، متابعة المدفوع والمتبقي، وتقرير يومي للخزنة.

## الصفحات

- **الرئيسية**: حالات النهارده، المحصل النهارده والشهر، والفلوس اللي برا عند المرضى.
- **تسجيل مريض**: بيانات المريض + الخدمة + الدفع. لو الموبايل متسجل قبل كده، الخدمة بتتسجل على نفس الملف (ولو فرد تاني من العيلة بنفس الرقم تقدر تفتحله ملف جديد).
- **المرضى**: بحث بالاسم أو الموبايل، وفلتر "عليهم فلوس بس".
- **ملف المريض**: سجل الخدمات والدفعات، إضافة خدمة جديدة، أو تسجيل دفعة على المتبقي.
- **تقرير اليوم**: الحالات وتوزيعها على الأطباء وإجمالي الخزنة، مع زرار طباعة.

## تعديل الأطباء والخدمات والأسعار

من ملف `src/config.js`.

## التشغيل

```bash
npm install
npm run dev
```

## خطوات لازم تتعمل مرة واحدة في Firebase Console (مشروع kufur-clinic)

1. **Authentication** > Sign-in method > فعّل **Email/Password**.
2. **Authentication** > Users > Add user: اعمل حساب لكل حد هيستخدم السيستم (الاستقبال، الدكاترة).
3. **Firestore Database** > Rules: الصق محتوى ملف `firestore.rules` واضغط Publish.
   ده أهم خطوة: من غيرها أي حد معاه رابط المشروع يقدر يقرا بيانات المرضى.

## الرفع على النت (Firebase Hosting، مجاني للحجم ده)

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
```

الموقع هيبقى على `https://kufur-clinic.web.app`.

## شكل البيانات في Firestore

- `patients`: name, age, phone, address
- `visits`: patientId, patientName, date, service, doctor, total, paid, notes
- `payments`: patientId, patientName, date, amount (دفعات لاحقة على المتبقي)

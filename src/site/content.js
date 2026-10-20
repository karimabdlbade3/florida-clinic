// كل نصوص وبيانات الموقع العام هنا. الصور بتتحط في public/images
export const SITE = {
  name: "عيادات فلوريدا",
  tagline: "لطب وتجميل الأسنان",
  whatsapp: "01012396044",
  phones: ["01148770555", "01554368176"],
  email: "floridadentalclinics37@gmail.com",
  facebook: "https://www.facebook.com/", // TODO: حط رابط صفحة الفيسبوك
  facebookName: "Florida Dental Clinics",
  instagram: "https://www.instagram.com/floridadentalclinics",
  instagramName: "floridadentalclinics",
};

export const BRANCHES = [
  { name: "فرع الإبراهيمية", address: "الإبراهيمية شارع حلواني أبو حازم أمام السبيل للأحذية" },
  { name: "فرع كفور نجم", address: "كفور نجم بجوار الزينة أعلى محلات أبو آدم للملابس" },
];

export const SERVICES = [
  { name: "الحشوات التجميلية", text: "حشوات بلون السن الطبيعي تعيد شكل السن من غير ما تبان." },
  { name: "حشو العصب", text: "علاج العصب بأحدث الأجهزة عشان تحافظ على سنك وتخلص من الألم." },
  { name: "تقويم الأسنان", text: "تقويم معدني وشفاف لترتيب الأسنان وتحسين الابتسامة والعضة." },
  { name: "زراعة الأسنان", text: "تعويض الأسنان المفقودة بزرعات ثابتة شكلها ووظيفتها زي السن الطبيعي." },
  { name: "التركيبات التجميلية", text: "تيجان وفينير وتركيبات ثابتة لابتسامة متناسقة." },
  { name: "أسنان الأطفال", text: "علاج أسنان الأطفال في جو مريح يخلي الزيارة تجربة حلوة." },
  { name: "تنظيف الجير وتلميع الأسنان", text: "إزالة الجير والتصبغات للحفاظ على صحة اللثة ولمعة الأسنان." },
  { name: "تبييض الأسنان", text: "تبييض آمن في العيادة لابتسامة أفتح بدرجات." },
];

export const ABOUT =
  "عيادات فلوريدا بتقدم كل خدمات طب وتجميل الأسنان تحت سقف واحد: من الحشو وعلاج العصب لحد التقويم والزراعة والتركيبات التجميلية. فريقنا من أخصائيين في كل تخصص، وبنشتغل بأحدث الأجهزة وبأعلى معايير التعقيم، عشان نوصلك لابتسامة صحية وواثقة في أقل عدد زيارات.";

// الصور: public/images/team/<photo>
export const TEAM = [
  { name: "دكتور محمود عبدالبديع", role: "أخصائي تقويم وجراحة الأسنان", photo: "mahmoud.jpg" },
  { name: "دكتور عمر محمد حسن", role: "أخصائي تجميل الأسنان والتركيبات الثابتة", photo: "omar.jpg" },
  { name: "دكتورة أشرقت أشرف", role: "أخصائي تجميل الأسنان وعلاج أسنان الأطفال", photo: "ashrakat.jpg" },
  { name: "مهندس كريم عبدالبديع", role: "مدير عيادات فلوريدا", photo: "karim.jpg" },
];

// الصور: public/images/cases/case1.jpg ... (كل صورة فيها قبل وبعد)
export const CASES = Array.from({ length: 12 }, (_, i) => `case${i + 1}.jpg`);

// آراء حقيقية بس، انسخها من تقييمات الفيسبوك: { name: "", text: "" }
export const REVIEWS = [];

export const STATS = [
  { label: "شهادات معتمدة", icon: "cert" },
  { label: "أحدث الأجهزة", icon: "chair" },
  { label: "+500 حالة نجاح", icon: "success" },
];

export const whatsappLink = (text = "") =>
  `https://wa.me/2${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mapLink = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " الزقازيق")}`;

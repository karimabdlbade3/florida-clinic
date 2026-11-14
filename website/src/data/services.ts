/**
 * Service content (Arabic + English).
 * Medical wording is intentionally careful: no guaranteed results, no
 * superlatives, suitability is always decided by the dentist after examination.
 * Have the clinical team review this text before launch.
 */
import type { Lang } from './branches';
type L<T = string> = Record<Lang, T>;

export type IconName = 'braces' | 'sparkle' | 'implant' | 'surgery' | 'child' | 'tooth' | 'root' | 'shield';

export interface Service {
  slug: string;
  /** true = one of the seven official service categories; false = secondary service. */
  main: boolean;
  icon: IconName;
  name: L;
  tagline: L;
  short: L;
  intro: L<string[]>;
  benefits: L<string[]>;
  suitableFor: L<string[]>;
  includes: L<string[]>;
  steps: L<{ title: string; text: string }[]>;
  faq: L<{ q: string; a: string }[]>;
  seo: { title: L; description: L };
}

export const services: Service[] = [
  {
    slug: 'orthodontics',
    main: true,
    icon: 'braces',
    name: { ar: 'تقويم الأسنان', en: 'Orthodontics' },
    tagline: { ar: 'أسنان منتظمة وعضّة متوازنة', en: 'Straighter teeth, a balanced bite' },
    short: {
      ar: 'علاج ازدحام الأسنان والفراغات ومشاكل العضّة للأطفال والكبار، بخطة واضحة ومتابعة منتظمة.',
      en: 'Treatment for crowding, gaps and bite problems for children and adults, with a clear plan and regular follow-up.',
    },
    intro: {
      ar: [
        'تقويم الأسنان لا يقتصر على شكل الابتسامة؛ فالأسنان المنتظمة أسهل في التنظيف، والعضّة المتوازنة توزّع الضغط على الأسنان والفكين بشكل أفضل.',
        'نبدأ بفحص دقيق وتقييم لوضع الأسنان والفكين، ثم نشرح لك الخيارات المناسبة لحالتك ومدة العلاج المتوقعة، حتى تتخذ قرارك وأنت مطمئن.',
      ],
      en: [
        'Orthodontics is about more than the look of your smile. Well-aligned teeth are easier to clean, and a balanced bite spreads pressure more evenly across your teeth and jaws.',
        'We start with a careful examination of your teeth and jaws, then walk you through the options that suit your case and the expected treatment time, so you can decide with confidence.',
      ],
    },
    benefits: {
      ar: ['تحسين انتظام الأسنان ومظهر الابتسامة', 'تسهيل تنظيف الأسنان والعناية اليومية بها', 'تحسين توازن العضّة ووظيفة المضغ', 'خطة علاج مكتوبة ومتابعة دورية لتطور الحالة'],
      en: ['Better alignment and a more even smile', 'Easier brushing, flossing and daily care', 'A more balanced bite and better chewing', 'A written treatment plan with regular progress checks'],
    },
    suitableFor: {
      ar: ['ازدحام الأسنان أو تراكبها', 'وجود فراغات بين الأسنان', 'بروز الأسنان الأمامية أو العضّة العميقة', 'العضّة المعكوسة أو المفتوحة', 'الأطفال في مرحلة نمو الفكين بعد تقييم الطبيب'],
      en: ['Crowded or overlapping teeth', 'Gaps between teeth', 'Protruding front teeth or a deep bite', 'Crossbite or open bite', 'Children whose jaws are still growing, after assessment'],
    },
    includes: {
      ar: ['فحص وتقييم شامل للأسنان والفكين', 'التقويم المعدني أو التجميلي حسب ملاءمة الحالة', 'أجهزة التقويم المتحركة للأطفال عند الحاجة', 'المثبّتات بعد انتهاء العلاج للحفاظ على النتيجة'],
      en: ['Full assessment of teeth and jaws', 'Metal or aesthetic braces, depending on suitability', 'Removable appliances for children when needed', 'Retainers after treatment to help keep the result'],
    },
    steps: {
      ar: [
        { title: 'الفحص والتشخيص', text: 'تقييم الأسنان والعضّة وطلب الأشعة اللازمة عند الحاجة.' },
        { title: 'خطة العلاج', text: 'شرح الخيارات المتاحة والمدة المتوقعة والتكلفة قبل البدء.' },
        { title: 'تركيب التقويم والمتابعة', text: 'زيارات متابعة منتظمة لضبط التقويم وتقييم التقدم.' },
        { title: 'مرحلة التثبيت', text: 'استخدام المثبّت حسب تعليمات الطبيب للحفاظ على النتيجة.' },
      ],
      en: [
        { title: 'Examination', text: 'We assess your teeth and bite and request X-rays where needed.' },
        { title: 'Treatment plan', text: 'We explain the options, expected duration and cost before you start.' },
        { title: 'Braces and follow-up', text: 'Regular visits to adjust your braces and track progress.' },
        { title: 'Retention', text: 'You wear a retainer as advised to help maintain the result.' },
      ],
    },
    faq: {
      ar: [
        { q: 'ما السن المناسب لبدء التقويم؟', a: 'لا يوجد سن واحد يناسب الجميع. يُفضّل تقييم الأطفال مبكرًا لمتابعة نمو الفكين، كما يمكن للكبار بدء التقويم بعد فحص صحة الأسنان واللثة.' },
        { q: 'كم تستغرق مدة التقويم؟', a: 'تختلف المدة حسب الحالة ونوع التقويم والتزام المريض بالتعليمات، ويحددها الطبيب بعد الفحص ووضع خطة العلاج.' },
        { q: 'هل التقويم مؤلم؟', a: 'قد تشعر بضغط أو انزعاج بسيط في الأيام الأولى وبعد جلسات الضبط، وغالبًا ما يخف تدريجيًا. سيشرح لك الطبيب كيفية التعامل معه.' },
      ],
      en: [
        { q: 'What is the right age to start braces?', a: 'There is no single right age. Early assessment helps us monitor jaw growth in children, and adults can start treatment once their teeth and gums are healthy.' },
        { q: 'How long does treatment take?', a: 'It depends on the case, the type of braces and how closely instructions are followed. Your orthodontist will estimate it after the examination.' },
        { q: 'Do braces hurt?', a: 'You may feel pressure or mild discomfort in the first days and after adjustments, which usually eases. Your dentist will explain how to manage it.' },
      ],
    },
    seo: {
      title: { ar: 'تقويم الأسنان في كفورنجم والإبراهيمية والزقازيق | عيادات فلوريدا', en: 'Orthodontics & Braces in Kafr Negm, Ibrahimia, Zagazig | Florida Dental' },
      description: {
        ar: 'تقويم الأسنان للأطفال والكبار في عيادات فلوريدا: علاج الازدحام والفراغات ومشاكل العضّة بخطة واضحة. اطلب موعد الكشف في أقرب فرع.',
        en: 'Orthodontic treatment for children and adults at Florida Dental Clinics: crowding, gaps and bite problems, with a clear plan. Request a consultation at your nearest branch.',
      },
    },
  },
  {
    slug: 'dental-implants',
    main: true,
    icon: 'implant',
    name: { ar: 'زراعة الأسنان', en: 'Dental Implants' },
    tagline: { ar: 'بديل ثابت للأسنان المفقودة', en: 'A fixed option for missing teeth' },
    short: {
      ar: 'تعويض الأسنان المفقودة بزرعات ثابتة بعد تقييم دقيق لحالة العظم واللثة والصحة العامة.',
      en: 'Replacing missing teeth with fixed implants after a careful assessment of bone, gums and general health.',
    },
    intro: {
      ar: [
        'زراعة الأسنان من الخيارات الشائعة لتعويض سن أو أكثر، حيث تُثبَّت دعامة داخل عظم الفك ثم يُركَّب عليها التاج أو التركيبة المناسبة.',
        'نهتم بالتقييم الجيد قبل الزراعة، بما في ذلك الأشعة وتقييم كثافة العظم والصحة العامة، لأن التخطيط السليم جزء أساسي من نجاح العلاج.',
      ],
      en: [
        'Dental implants are a common way to replace one or more teeth. A small post is placed in the jawbone and then fitted with a crown or another suitable restoration.',
        'We take the assessment seriously, including X-rays, bone evaluation and your general health, because careful planning is a key part of good treatment.',
      ],
    },
    benefits: {
      ar: ['تعويض ثابت لا يحتاج إلى خلعه يوميًا', 'تحسين القدرة على المضغ والكلام', 'الحفاظ على الأسنان المجاورة دون الحاجة لبردها في كثير من الحالات', 'مظهر قريب من الأسنان الطبيعية'],
      en: ['A fixed replacement you do not remove daily', 'Better chewing and clearer speech', 'Often no need to reshape neighbouring teeth', 'A look close to natural teeth'],
    },
    suitableFor: {
      ar: ['فقدان سن واحد أو عدة أسنان', 'عدم الارتياح للتركيبات المتحركة', 'وجود كثافة عظم مناسبة أو إمكانية تعويضها حسب تقييم الطبيب', 'الحالة الصحية العامة التي تسمح بالإجراء'],
      en: ['One or several missing teeth', 'Discomfort with removable dentures', 'Adequate bone, or bone that can be supported, as assessed', 'General health that allows the procedure'],
    },
    includes: {
      ar: ['تقييم الحالة والأشعة اللازمة', 'زراعة سن واحد أو عدة أسنان', 'التركيبات الثابتة على الزرعات', 'الإجراءات المساعدة عند الحاجة حسب تقييم الطبيب', 'متابعة دورية بعد التركيب'],
      en: ['Case assessment and required imaging', 'Single or multiple implants', 'Fixed restorations on implants', 'Supporting procedures where needed, as assessed', 'Regular follow-up after placement'],
    },
    steps: {
      ar: [
        { title: 'التقييم والأشعة', text: 'فحص الفم وتقييم العظم والصحة العامة.' },
        { title: 'خطة الزراعة', text: 'شرح المراحل والمدة والتكلفة قبل البدء.' },
        { title: 'وضع الزرعة', text: 'إجراء الزراعة مع إرشادات واضحة للعناية بعدها.' },
        { title: 'التركيبة النهائية', text: 'تركيب التاج أو التركيبة بعد فترة الالتئام والمتابعة.' },
      ],
      en: [
        { title: 'Assessment', text: 'Oral examination, bone evaluation and a health review.' },
        { title: 'Implant plan', text: 'We explain the stages, timeline and cost before starting.' },
        { title: 'Placement', text: 'The implant is placed, with clear aftercare instructions.' },
        { title: 'Final restoration', text: 'The crown is fitted after healing and follow-up.' },
      ],
    },
    faq: {
      ar: [
        { q: 'هل زراعة الأسنان مناسبة لأي شخص؟', a: 'ليست مناسبة للجميع. تعتمد على حالة العظم واللثة والصحة العامة وبعض العادات مثل التدخين. يحدد الطبيب مدى ملاءمتها بعد الفحص والأشعة.' },
        { q: 'هل الزراعة مؤلمة؟', a: 'تُجرى الزراعة عادة تحت تخدير موضعي. قد يحدث بعض الانزعاج أو التورم بعدها لفترة، وسيعطيك الطبيب إرشادات للتعامل معه.' },
        { q: 'كم تستغرق مراحل الزراعة؟', a: 'تختلف المدة من حالة لأخرى حسب العظم وفترة الالتئام والحاجة لإجراءات مساعدة، وسيوضحها الطبيب في خطة العلاج.' },
      ],
      en: [
        { q: 'Are implants suitable for everyone?', a: 'Not always. It depends on your bone, gums, general health and habits such as smoking. Your dentist will decide after an examination and X-rays.' },
        { q: 'Does implant surgery hurt?', a: 'Implants are usually placed under local anaesthetic. Some discomfort or swelling afterwards is common for a while, and you will be given clear aftercare advice.' },
        { q: 'How long does the whole process take?', a: 'It varies with your bone, healing time and whether supporting procedures are needed. Your dentist will set this out in your treatment plan.' },
      ],
    },
    seo: {
      title: { ar: 'زراعة الأسنان في الشرقية | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Dental Implants in Sharqia | Florida Dental Clinics' },
      description: {
        ar: 'زراعة الأسنان في عيادات فلوريدا بعد تقييم دقيق للعظم واللثة والصحة العامة. تعويض ثابت للأسنان المفقودة. فروع كفورنجم والإبراهيمية والزقازيق.',
        en: 'Dental implants at Florida Dental Clinics, planned after careful assessment of bone, gums and general health. Fixed replacement for missing teeth in Kafr Negm, Ibrahimia and Zagazig.',
      },
    },
  },
  {
    slug: 'cosmetic-dentistry',
    main: true,
    icon: 'sparkle',
    name: { ar: 'تجميل الأسنان', en: 'Cosmetic Dentistry' },
    tagline: { ar: 'ابتسامة طبيعية تشبهك', en: 'A natural smile that looks like you' },
    short: {
      ar: 'تبييض، فينير، وتجميل الابتسامة بخطة تراعي ملامح وجهك وصحة أسنانك أولًا.',
      en: 'Whitening, veneers and smile design, planned around your features and the health of your teeth.',
    },
    intro: {
      ar: [
        'هدفنا في تجميل الأسنان هو ابتسامة متناسقة وطبيعية، وليس مظهرًا مبالغًا فيه. لذلك نبدأ دائمًا بفحص صحة الأسنان واللثة قبل أي إجراء تجميلي.',
        'نستمع لما تريده، ونشرح لك ما يمكن تحقيقه بشكل واقعي، والخيارات المتاحة ومميزات وحدود كل خيار.',
      ],
      en: [
        'Our aim in cosmetic dentistry is a balanced, natural smile, not an overdone look. That is why we always check the health of your teeth and gums before any cosmetic work.',
        'We listen to what you want, explain what can realistically be achieved, and go through the available options with their benefits and limits.',
      ],
    },
    benefits: {
      ar: ['تحسين لون الأسنان وتناسق شكلها', 'إصلاح الكسور البسيطة والتصبغات والفراغات الصغيرة', 'نتيجة تراعي ملامح الوجه وشكل الابتسامة', 'خطة تجميل مبنية على أسنان ولثة سليمة'],
      en: ['A brighter shade and more even tooth shape', 'Repair of minor chips, stains and small gaps', 'Results planned around your facial features', 'Cosmetic work built on healthy teeth and gums'],
    },
    suitableFor: {
      ar: ['تغيّر لون الأسنان أو وجود تصبغات', 'كسور بسيطة أو تآكل في حواف الأسنان', 'اختلاف أحجام أو أشكال الأسنان', 'فراغات صغيرة بين الأسنان الأمامية', 'الرغبة في تحسين شكل الابتسامة بشكل عام'],
      en: ['Discoloured or stained teeth', 'Minor chips or worn edges', 'Uneven tooth size or shape', 'Small gaps between front teeth', 'Anyone wanting a more confident smile'],
    },
    includes: {
      ar: ['تبييض الأسنان في العيادة حسب ملاءمة الحالة', 'القشور التجميلية (الفينير)', 'الحشوات التجميلية بلون الأسنان', 'التيجان التجميلية', 'تصميم الابتسامة وخطة تجميل متكاملة'],
      en: ['In-clinic teeth whitening where suitable', 'Veneers', 'Tooth-coloured cosmetic fillings', 'Aesthetic crowns', 'Smile design and a complete cosmetic plan'],
    },
    steps: {
      ar: [
        { title: 'استشارة وفحص', text: 'نفهم ما تريده ونفحص صحة الأسنان واللثة.' },
        { title: 'علاج ما يلزم أولًا', text: 'معالجة التسوس أو مشاكل اللثة قبل أي إجراء تجميلي.' },
        { title: 'خطة التجميل', text: 'عرض الخيارات المناسبة والتكلفة والمدة المتوقعة.' },
        { title: 'التنفيذ والمتابعة', text: 'تنفيذ الخطة وإرشادات العناية للحفاظ على النتيجة.' },
      ],
      en: [
        { title: 'Consultation', text: 'We understand your goals and check your teeth and gums.' },
        { title: 'Treat first', text: 'Any decay or gum problems are treated before cosmetic work.' },
        { title: 'Cosmetic plan', text: 'We present suitable options, cost and expected timeline.' },
        { title: 'Treatment and care', text: 'We carry out the plan and show you how to look after it.' },
      ],
    },
    faq: {
      ar: [
        { q: 'هل تبييض الأسنان يضر بالأسنان؟', a: 'عند إجرائه تحت إشراف طبيب وبعد التأكد من ملاءمة الحالة، يكون التبييض إجراءً آمنًا بشكل عام. قد تظهر حساسية مؤقتة لدى بعض الأشخاص، وسيوضح لك الطبيب ما يناسبك.' },
        { q: 'هل الفينير مناسب للجميع؟', a: 'لا. يعتمد ذلك على صحة الأسنان واللثة وطريقة العضّة وبعض العادات مثل الضغط على الأسنان. يحدد الطبيب الخيار الأنسب بعد الفحص.' },
        { q: 'كم تدوم نتيجة التجميل؟', a: 'تختلف حسب نوع الإجراء والعناية اليومية والعادات الغذائية والمتابعة الدورية، وسيشرح لك الطبيب ما يمكن توقعه لحالتك.' },
      ],
      en: [
        { q: 'Is whitening harmful to teeth?', a: 'When it is supervised by a dentist and your case is suitable, whitening is generally safe. Some people notice temporary sensitivity, and your dentist will advise what suits you.' },
        { q: 'Are veneers right for everyone?', a: 'No. It depends on the health of your teeth and gums, your bite and habits such as grinding. Your dentist will recommend the best option after an examination.' },
        { q: 'How long do cosmetic results last?', a: 'It varies with the procedure, your daily care, diet and regular check-ups. Your dentist will explain what to expect in your case.' },
      ],
    },
    seo: {
      title: { ar: 'تجميل الأسنان وتبييضها والفينير | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Cosmetic Dentistry, Whitening & Veneers | Florida Dental Clinics' },
      description: {
        ar: 'تجميل الأسنان في عيادات فلوريدا: تبييض، فينير، حشوات تجميلية وتصميم ابتسامة طبيعية بعد فحص صحة الأسنان واللثة. فروع كفورنجم والإبراهيمية والزقازيق.',
        en: 'Cosmetic dentistry at Florida Dental Clinics: whitening, veneers, tooth-coloured fillings and natural smile design after a full check-up. Branches in Kafr Negm, Ibrahimia and Zagazig.',
      },
    },
  },
  {
    slug: 'dental-fillings',
    main: true,
    icon: 'tooth',
    name: { ar: 'حشو الأسنان', en: 'Dental Fillings' },
    tagline: { ar: 'إصلاح التسوس والحفاظ على السن', en: 'Repair decay, keep the tooth' },
    short: {
      ar: 'علاج التسوس بحشوات بلون الأسنان تعيد للسن شكله ووظيفته، مع الحفاظ على أكبر قدر ممكن من السن الطبيعي.',
      en: 'Treating decay with tooth-coloured fillings that restore shape and function while keeping as much natural tooth as possible.',
    },
    intro: {
      ar: [
        'التسوس يبدأ صغيرًا ويمكن علاجه بسهولة أكبر عند اكتشافه مبكرًا. في الحشو يزيل الطبيب الجزء المتسوس من السن ثم يعوّضه بمادة حشو مناسبة تعيد للسن شكله ووظيفته.',
        'نشرح لك حالة السن وخيارات الحشو المتاحة قبل البدء، ونوضح متى يكون الحشو كافيًا ومتى يحتاج السن إلى علاج آخر.',
      ],
      en: [
        'Decay starts small and is easier to treat when caught early. For a filling, the dentist removes the decayed part of the tooth and rebuilds it with a suitable material that restores its shape and function.',
        'We explain the condition of the tooth and the filling options before we start, and make clear when a filling is enough and when the tooth needs a different treatment.',
      ],
    },
    benefits: {
      ar: ['إيقاف تقدم التسوس وحماية السن', 'استعادة شكل السن ووظيفة المضغ', 'حشوات بلون الأسنان الطبيعي', 'الحفاظ على السن الطبيعي قدر الإمكان'],
      en: ['Stops decay from progressing and protects the tooth', 'Restores tooth shape and chewing function', 'Tooth-coloured materials', 'Keeps the natural tooth where possible'],
    },
    suitableFor: {
      ar: ['تسوس الأسنان في مراحله الأولى أو المتوسطة', 'حساسية أو ألم عند الأكل والشرب بسبب التسوس', 'كسور بسيطة في السن', 'حشوات قديمة تحتاج إلى استبدال حسب تقييم الطبيب'],
      en: ['Early or moderate tooth decay', 'Sensitivity or pain when eating or drinking caused by decay', 'Minor tooth fractures', 'Old fillings that need replacing, as assessed'],
    },
    includes: {
      ar: ['الكشف والتشخيص والأشعة عند الحاجة', 'الحشوات التجميلية بلون الأسنان', 'حشو الأسنان الأمامية والخلفية', 'استبدال الحشوات القديمة عند الحاجة'],
      en: ['Examination, diagnosis and X-rays where needed', 'Tooth-coloured fillings', 'Fillings for front and back teeth', 'Replacement of old fillings where needed'],
    },
    steps: {
      ar: [
        { title: 'الكشف', text: 'فحص السن وتحديد مدى التسوس.' },
        { title: 'التخدير الموضعي', text: 'عند الحاجة، لراحتك أثناء العلاج.' },
        { title: 'إزالة التسوس والحشو', text: 'تنظيف السن ثم وضع مادة الحشو وتشكيلها.' },
        { title: 'ضبط العضّة', text: 'التأكد من راحة الإطباق وإرشادات العناية.' },
      ],
      en: [
        { title: 'Examination', text: 'We check the tooth and the extent of decay.' },
        { title: 'Local anaesthetic', text: 'Used where needed, for your comfort.' },
        { title: 'Removal and filling', text: 'The tooth is cleaned, then filled and shaped.' },
        { title: 'Bite check', text: 'We check your bite and give care advice.' },
      ],
    },
    faq: {
      ar: [
        { q: 'هل حشو الأسنان مؤلم؟', a: 'يُجرى الحشو عادة تحت تخدير موضعي عند الحاجة. قد تشعر بحساسية بسيطة بعده لفترة قصيرة، وغالبًا ما تزول تدريجيًا.' },
        { q: 'كم يدوم الحشو؟', a: 'يختلف ذلك حسب حجم الحشو ومكانه والعناية اليومية وعادات المضغ. يتابع الطبيب حالة الحشوات في الكشف الدوري.' },
        { q: 'متى لا يكفي الحشو؟', a: 'إذا وصل التسوس إلى عصب السن أو كان التلف كبيرًا، قد يحتاج السن إلى علاج جذور أو تاج. يحدد الطبيب ذلك بعد الفحص والأشعة.' },
      ],
      en: [
        { q: 'Does a filling hurt?', a: 'Fillings are usually done under local anaesthetic where needed. You may notice mild sensitivity for a short time afterwards, which usually settles.' },
        { q: 'How long does a filling last?', a: 'It depends on the size and position of the filling, your daily care and chewing habits. Your dentist checks your fillings at routine visits.' },
        { q: 'When is a filling not enough?', a: 'If decay has reached the nerve or the damage is extensive, the tooth may need root canal treatment or a crown. Your dentist decides after an examination and X-rays.' },
      ],
    },
    seo: {
      title: { ar: 'حشو الأسنان وعلاج التسوس | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Dental Fillings & Decay Treatment | Florida Dental Clinics' },
      description: {
        ar: 'حشو الأسنان في عيادات فلوريدا: علاج التسوس بحشوات بلون الأسنان مع الحفاظ على السن الطبيعي. فروع كفورنجم والإبراهيمية والزقازيق.',
        en: 'Dental fillings at Florida Dental Clinics: decay treated with tooth-coloured fillings that keep your natural tooth. Branches in Kafr Negm, Ibrahimia and Zagazig.',
      },
    },
  },
  {
    slug: 'root-canal-treatment',
    main: true,
    icon: 'root',
    name: { ar: 'علاج الجذور', en: 'Root Canal Treatment' },
    tagline: { ar: 'تخفيف الألم وإنقاذ السن', en: 'Relieve pain, save the tooth' },
    short: {
      ar: 'علاج عصب السن الملتهب أو المصاب (حشو العصب) لتخفيف الألم والحفاظ على السن بدلًا من خلعه.',
      en: 'Treatment of an inflamed or infected tooth nerve to relieve pain and keep the tooth instead of removing it.',
    },
    intro: {
      ar: [
        'عندما يصل التسوس أو الإصابة إلى عصب السن قد يسبب ألمًا شديدًا أو التهابًا. علاج الجذور، المعروف بحشو العصب، يزيل النسيج المصاب من داخل السن ثم ينظف القنوات ويحشوها.',
        'الهدف من العلاج هو تخفيف الألم والحفاظ على السن الطبيعي. نشرح لك الخطوات وعدد الجلسات المتوقع، وما يحتاجه السن بعد العلاج.',
      ],
      en: [
        'When decay or injury reaches the nerve of a tooth it can cause severe pain or infection. Root canal treatment removes the affected tissue from inside the tooth, then cleans and fills the canals.',
        'The aim is to relieve pain and keep the natural tooth. We explain the steps, the expected number of visits, and what the tooth needs after treatment.',
      ],
    },
    benefits: {
      ar: ['تخفيف الألم الناتج عن التهاب العصب', 'الحفاظ على السن الطبيعي بدلًا من خلعه', 'علاج الالتهاب ومنع انتشاره', 'استعادة القدرة على المضغ بعد ترميم السن'],
      en: ['Relief from the pain of an inflamed nerve', 'Keeps the natural tooth instead of extracting it', 'Treats infection and stops it spreading', 'Restores chewing once the tooth is rebuilt'],
    },
    suitableFor: {
      ar: ['ألم شديد أو مستمر في السن', 'التهاب العصب نتيجة تسوس عميق', 'خُرّاج أو تورم حول السن', 'سن تعرض لإصابة أثّرت على العصب حسب تقييم الطبيب'],
      en: ['Severe or persistent toothache', 'Nerve inflammation from deep decay', 'An abscess or swelling around a tooth', 'A tooth whose nerve was affected by injury, as assessed'],
    },
    includes: {
      ar: ['الكشف والأشعة لتقييم السن والجذور', 'علاج عصب الأسنان الأمامية والخلفية', 'تنظيف القنوات وحشوها', 'ترميم السن بعد العلاج بحشو أو تاج حسب الحالة'],
      en: ['Examination and X-rays of the tooth and roots', 'Root canal treatment for front and back teeth', 'Cleaning and filling of the canals', 'Rebuilding the tooth afterwards with a filling or crown, as needed'],
    },
    steps: {
      ar: [
        { title: 'الكشف والأشعة', text: 'تقييم حالة السن والعصب والجذور.' },
        { title: 'التخدير الموضعي', text: 'لراحتك طوال الجلسة.' },
        { title: 'تنظيف القنوات وحشوها', text: 'إزالة النسيج المصاب ثم حشو القنوات.' },
        { title: 'ترميم السن', text: 'حشو أو تاج لحماية السن بعد العلاج.' },
      ],
      en: [
        { title: 'Examination', text: 'We assess the tooth, nerve and roots with X-rays.' },
        { title: 'Local anaesthetic', text: 'For your comfort throughout the visit.' },
        { title: 'Cleaning and filling', text: 'Affected tissue is removed and the canals are filled.' },
        { title: 'Rebuilding', text: 'A filling or crown protects the tooth afterwards.' },
      ],
    },
    faq: {
      ar: [
        { q: 'هل علاج العصب مؤلم؟', a: 'يُجرى علاج العصب تحت تخدير موضعي، والهدف منه تخفيف الألم الناتج عن التهاب العصب. قد تشعر ببعض الانزعاج بعده لفترة قصيرة.' },
        { q: 'كم جلسة يحتاج علاج الجذور؟', a: 'يختلف عدد الجلسات حسب السن وعدد القنوات ودرجة الالتهاب، ويوضحه الطبيب بعد الفحص والأشعة.' },
        { q: 'هل يحتاج السن إلى تاج بعد علاج العصب؟', a: 'في كثير من الحالات يُنصح بتاج لحماية السن، خاصة الأسنان الخلفية. يحدد الطبيب ما يناسب حالتك.' },
      ],
      en: [
        { q: 'Is root canal treatment painful?', a: 'It is done under local anaesthetic, and its purpose is to relieve the pain of an inflamed nerve. Some discomfort afterwards for a short time is normal.' },
        { q: 'How many visits does it take?', a: 'It varies with the tooth, the number of canals and the degree of infection. Your dentist will explain after the examination and X-rays.' },
        { q: 'Will the tooth need a crown afterwards?', a: 'In many cases a crown is advised to protect the tooth, especially back teeth. Your dentist will recommend what suits your case.' },
      ],
    },
    seo: {
      title: { ar: 'علاج الجذور وحشو العصب | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Root Canal Treatment | Florida Dental Clinics' },
      description: {
        ar: 'علاج الجذور (حشو العصب) في عيادات فلوريدا لتخفيف ألم العصب والحفاظ على السن بدلًا من خلعه. فروع كفورنجم والإبراهيمية والزقازيق.',
        en: 'Root canal treatment at Florida Dental Clinics to relieve nerve pain and keep your tooth instead of removing it. Branches in Kafr Negm, Ibrahimia and Zagazig.',
      },
    },
  },
  {
    slug: 'pediatric-dentistry',
    main: true,
    icon: 'child',
    name: { ar: 'طب أسنان الأطفال', en: 'Pediatric Dentistry' },
    tagline: { ar: 'زيارة هادئة لطفلك', en: 'A calm visit for your child' },
    short: {
      ar: 'رعاية أسنان الأطفال بأسلوب هادئ يبني الثقة، مع التركيز على الوقاية والمتابعة المبكرة.',
      en: 'Gentle dental care for children that builds trust, with a focus on prevention and early check-ups.',
    },
    intro: {
      ar: [
        'التجربة الأولى للطفل عند طبيب الأسنان تؤثر على علاقته بالعناية بأسنانه لسنوات. لذلك نتعامل مع الأطفال بهدوء وصبر، ونشرح لهم بلغة بسيطة ما سنفعله.',
        'نهتم بالوقاية والاكتشاف المبكر، ونشرك الوالدين في خطة العناية اليومية بأسنان الطفل في المنزل.',
      ],
      en: [
        "A child's first dental visits can shape how they feel about caring for their teeth for years. We are calm and patient with children and explain what we are doing in simple words.",
        'We focus on prevention and early detection, and involve parents in the daily care plan at home.',
      ],
    },
    benefits: {
      ar: ['تجربة مريحة تقلل خوف الطفل من الطبيب', 'اكتشاف التسوس والمشاكل مبكرًا', 'إجراءات وقائية تساعد على حماية الأسنان', 'إرشادات عملية للوالدين للعناية اليومية'],
      en: ['A comfortable visit that reduces fear', 'Early detection of decay and other problems', 'Preventive care to help protect teeth', 'Practical guidance for parents at home'],
    },
    suitableFor: {
      ar: ['الزيارة الأولى للطفل والفحص الدوري', 'تسوس الأسنان اللبنية أو الدائمة', 'الأطفال الذين يشعرون بالخوف من طبيب الأسنان', 'متابعة نمو الأسنان والفكين'],
      en: ["A child's first visit and routine check-ups", 'Decay in baby or permanent teeth', 'Children who feel anxious about the dentist', 'Monitoring tooth and jaw development'],
    },
    includes: {
      ar: ['الفحص الدوري للأطفال', 'تطبيقات الفلورايد الوقائية', 'سد الشقوق والميازيب', 'علاج تسوس الأسنان اللبنية', 'علاج عصب الأسنان اللبنية', 'حافظات المسافة عند الحاجة'],
      en: ['Routine check-ups for children', 'Preventive fluoride application', 'Fissure sealants', 'Treatment of decay in baby teeth', 'Baby tooth nerve treatment (pulpotomy)', 'Space maintainers when needed'],
    },
    steps: {
      ar: [
        { title: 'التعارف', text: 'نتعرف على الطفل ونساعده على الشعور بالأمان.' },
        { title: 'الفحص', text: 'فحص لطيف للأسنان واللثة ومتابعة النمو.' },
        { title: 'خطة بسيطة', text: 'شرح ما يحتاجه الطفل للوالدين بوضوح.' },
        { title: 'الوقاية والمتابعة', text: 'إرشادات منزلية ومواعيد متابعة دورية.' },
      ],
      en: [
        { title: 'Getting to know', text: 'We help your child feel safe and at ease.' },
        { title: 'Gentle check', text: 'A gentle look at teeth, gums and development.' },
        { title: 'Simple plan', text: 'We explain clearly to parents what is needed.' },
        { title: 'Prevention', text: 'Home-care advice and regular follow-up visits.' },
      ],
    },
    faq: {
      ar: [
        { q: 'متى تكون أول زيارة للطفل؟', a: 'يُنصح عمومًا بزيارة طبيب الأسنان مع ظهور الأسنان الأولى أو في حدود عمر السنة، ثم المتابعة الدورية حسب توصية الطبيب.' },
        { q: 'هل يجب علاج الأسنان اللبنية رغم أنها ستتغير؟', a: 'نعم في أغلب الحالات، فالأسنان اللبنية تساعد على المضغ والنطق وتحافظ على المسافة للأسنان الدائمة، وإهمال التسوس قد يسبب ألمًا والتهابًا.' },
        { q: 'كيف أجهز طفلي للزيارة؟', a: 'تحدث معه بشكل إيجابي وهادئ، وتجنب الكلمات المخيفة. يمكنك أيضًا إخبارنا مسبقًا إذا كان الطفل قلقًا لنستعد لذلك.' },
      ],
      en: [
        { q: "When should my child's first visit be?", a: 'A first visit is generally recommended when the first teeth appear or around the age of one, followed by regular check-ups as advised.' },
        { q: 'Do baby teeth really need treatment?', a: 'In most cases, yes. Baby teeth help with chewing and speech and hold space for adult teeth, and untreated decay can cause pain and infection.' },
        { q: 'How can I prepare my child?', a: 'Talk about the visit in a calm, positive way and avoid scary words. Let us know in advance if your child is anxious so we can prepare.' },
      ],
    },
    seo: {
      title: { ar: 'طب أسنان الأطفال | عيادات فلوريدا - كفورنجم والإبراهيمية والزقازيق', en: "Pediatric Dentist for Children | Florida Dental Clinics" },
      description: {
        ar: 'رعاية أسنان الأطفال في عيادات فلوريدا بأسلوب هادئ: فحص دوري، فلورايد، سد الشقوق وعلاج الأسنان اللبنية. اطلب موعدًا لطفلك في أقرب فرع.',
        en: "Gentle children's dentistry at Florida Dental Clinics: check-ups, fluoride, sealants and baby tooth treatment. Request an appointment for your child at your nearest branch.",
      },
    },
  },
  {
    slug: 'tooth-extraction',
    main: true,
    icon: 'surgery',
    name: { ar: 'خلع الأسنان', en: 'Tooth Extraction' },
    tagline: { ar: 'إجراءات دقيقة في بيئة مطمئنة', en: 'Precise procedures, calm environment' },
    short: {
      ar: 'خلع الأسنان العادي والجراحي وضرس العقل والإجراءات الجراحية البسيطة، مع اهتمام بالتعقيم وراحتك.',
      en: 'Routine and surgical extractions, wisdom teeth and minor oral procedures, with close attention to sterilisation and comfort.',
    },
    intro: {
      ar: [
        'يشعر كثير من الناس بالقلق قبل أي إجراء جراحي في الفم، لذلك نحرص على شرح كل خطوة قبل البدء، والإجابة عن أسئلتك بوضوح.',
        'نلتزم بإجراءات التعقيم ومكافحة العدوى، ونعطيك تعليمات مكتوبة للعناية بعد الإجراء ومتى يجب التواصل معنا.',
      ],
      en: [
        'Many people feel anxious before oral surgery, so we explain every step before we begin and answer your questions clearly.',
        'We follow strict sterilisation and infection-control procedures, and give you written aftercare instructions, including when to contact us.',
      ],
    },
    benefits: {
      ar: ['التخلص من الألم الناتج عن الأسنان التالفة أو المدفونة', 'التعامل مع ضرس العقل المسبب للمشاكل', 'تجهيز الفم لعلاجات أخرى مثل التقويم أو الزراعة', 'شرح واضح للإجراء وتعليمات العناية بعده'],
      en: ['Relief from pain caused by damaged or impacted teeth', 'Management of troublesome wisdom teeth', 'Preparing the mouth for braces or implants', 'Clear explanations and aftercare guidance'],
    },
    suitableFor: {
      ar: ['ضرس العقل المدفون أو المسبب للألم والالتهاب', 'الأسنان التالفة التي لا يمكن علاجها', 'الحالات التي تحتاج خلعًا قبل التقويم', 'بعض الإجراءات الجراحية البسيطة في الفم حسب تقييم الطبيب'],
      en: ['Impacted or painful wisdom teeth', 'Teeth damaged beyond repair', 'Extractions needed before orthodontic treatment', 'Minor oral surgical procedures, as assessed'],
    },
    includes: {
      ar: ['الخلع العادي', 'الخلع الجراحي', 'خلع ضرس العقل', 'الإجراءات الجراحية البسيطة في الفم', 'المتابعة بعد الإجراء'],
      en: ['Routine extractions', 'Surgical extractions', 'Wisdom tooth removal', 'Minor oral surgical procedures', 'Post-procedure follow-up'],
    },
    steps: {
      ar: [
        { title: 'الفحص والأشعة', text: 'تقييم السن وما حوله وتحديد الإجراء المناسب.' },
        { title: 'شرح الإجراء', text: 'توضيح الخطوات والتخدير وما يمكن توقعه بعدها.' },
        { title: 'الإجراء', text: 'تنفيذ الإجراء مع الالتزام الكامل بالتعقيم.' },
        { title: 'العناية والمتابعة', text: 'تعليمات مكتوبة وموعد متابعة عند الحاجة.' },
      ],
      en: [
        { title: 'Examination', text: 'We assess the tooth and surrounding area with X-rays.' },
        { title: 'Explanation', text: 'We explain the steps, anaesthetic and what to expect after.' },
        { title: 'Procedure', text: 'Carried out under full sterilisation protocols.' },
        { title: 'Aftercare', text: 'Written instructions and a follow-up visit if needed.' },
      ],
    },
    faq: {
      ar: [
        { q: 'هل يجب خلع ضرس العقل دائمًا؟', a: 'لا. يُنصح بخلعه عادة إذا كان يسبب ألمًا أو التهابًا أو يؤثر على الأسنان المجاورة. يقرر الطبيب ذلك بعد الفحص والأشعة.' },
        { q: 'ماذا أفعل بعد الخلع؟', a: 'ستحصل على تعليمات مفصلة تشمل الأكل والشرب والعناية بالمكان والأدوية إن لزم. تواصل معنا إذا استمر النزيف أو الألم بشكل غير معتاد.' },
        { q: 'هل أحتاج لإجازة بعد الخلع الجراحي؟', a: 'يختلف ذلك حسب الحالة وطبيعة عملك. كثير من الأشخاص يحتاجون للراحة يومًا أو أكثر، وسيعطيك الطبيب توصية مناسبة.' },
      ],
      en: [
        { q: 'Do wisdom teeth always need to come out?', a: 'No. Removal is usually advised if they cause pain, infection or affect neighbouring teeth. Your dentist decides after an examination and X-rays.' },
        { q: 'What should I do after an extraction?', a: 'You will receive detailed instructions on eating, drinking, caring for the area and any medication. Contact us if bleeding or pain is unusual or persists.' },
        { q: 'Will I need time off after surgical extraction?', a: 'It depends on the case and your work. Many people rest for a day or more, and your dentist will give you a recommendation.' },
      ],
    },
    seo: {
      title: { ar: 'خلع الأسنان وضرس العقل | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Tooth Extraction & Wisdom Teeth | Florida Dental Clinics' },
      description: {
        ar: 'الخلع العادي والجراحي وخلع ضرس العقل في عيادات فلوريدا، مع التزام بالتعقيم وشرح واضح للإجراء. فروع كفورنجم والإبراهيمية والزقازيق.',
        en: 'Routine and surgical extractions and wisdom tooth removal at Florida Dental Clinics, with strict sterilisation and clear explanations. Kafr Negm, Ibrahimia and Zagazig.',
      },
    },
  },
  {
    slug: 'general-dentistry',
    main: false,
    icon: 'shield',
    name: { ar: 'الكشف والرعاية العامة', en: 'Check-ups & General Care' },
    tagline: { ar: 'الأساس لصحة فم تدوم', en: 'The foundation of lasting oral health' },
    short: {
      ar: 'الكشف الدوري، تنظيف الجير وتلميع الأسنان، التيجان والجسور، والتركيبات المتحركة، للحفاظ على أسنانك ومعالجة المشاكل مبكرًا.',
      en: 'Routine check-ups, scaling and polishing, crowns and bridges, and removable dentures, to protect your teeth and treat problems early.',
    },
    intro: {
      ar: [
        'معظم مشاكل الأسنان تبدأ صغيرة ويمكن علاجها بسهولة أكبر عند اكتشافها مبكرًا. لهذا نعتبر الكشف الدوري والعلاج العام أساس كل خطة علاج.',
        'نشرح لك حالة أسنانك بوضوح، ونرتب الأولويات معك، حتى تعرف ما هو ضروري الآن وما يمكن تأجيله.',
      ],
      en: [
        'Most dental problems start small and are easier to treat when caught early. That is why check-ups and general care are the foundation of every treatment plan.',
        'We explain the condition of your teeth clearly and agree priorities with you, so you know what needs attention now and what can wait.',
      ],
    },
    benefits: {
      ar: ['اكتشاف التسوس ومشاكل اللثة مبكرًا', 'تعويض الأسنان المفقودة أو التالفة بالتركيبات المناسبة', 'تنظيف الجير والمساعدة في الحفاظ على صحة اللثة', 'خطة علاج واضحة ومرتبة حسب الأولوية'],
      en: ['Early detection of decay and gum disease', 'Replacement of missing or damaged teeth with suitable restorations', 'Scaling that helps keep gums healthy', 'A clear treatment plan ordered by priority'],
    },
    suitableFor: {
      ar: ['الكشف الدوري للكبار', 'ألم الأسنان أو الحساسية', 'الأسنان التي تحتاج إلى تاج أو جسر', 'فقدان عدة أسنان والحاجة لتركيبة متحركة', 'نزيف اللثة أو تراكم الجير'],
      en: ['Routine adult check-ups', 'Toothache or sensitivity', 'Teeth that need a crown or bridge', 'Several missing teeth needing a removable denture', 'Bleeding gums or tartar build-up'],
    },
    includes: {
      ar: ['الكشف الدوري والتشخيص', 'تنظيف الجير وتلميع الأسنان', 'التيجان والجسور', 'التركيبات المتحركة'],
      en: ['Routine check-ups and diagnosis', 'Scaling and polishing', 'Crowns and bridges', 'Removable dentures'],
    },
    steps: {
      ar: [
        { title: 'الكشف', text: 'فحص شامل للأسنان واللثة والأشعة عند الحاجة.' },
        { title: 'شرح الحالة', text: 'توضيح المشاكل الموجودة وأولويات العلاج.' },
        { title: 'العلاج', text: 'تنفيذ العلاج على مراحل واضحة ومتفق عليها.' },
        { title: 'الوقاية', text: 'نصائح للعناية اليومية وموعد الكشف التالي.' },
      ],
      en: [
        { title: 'Check-up', text: 'A full examination of teeth and gums, with X-rays if needed.' },
        { title: 'Explanation', text: 'We explain what we found and the treatment priorities.' },
        { title: 'Treatment', text: 'Carried out in clear, agreed stages.' },
        { title: 'Prevention', text: 'Daily-care advice and your next check-up date.' },
      ],
    },
    faq: {
      ar: [
        { q: 'كم مرة يُنصح بالكشف على الأسنان؟', a: 'يُنصح عادة بالكشف الدوري كل ستة أشهر تقريبًا، وقد يوصي الطبيب بمواعيد مختلفة حسب حالة أسنانك ولثتك.' },
        { q: 'متى أحتاج إلى تاج أو جسر؟', a: 'يُستخدم التاج لحماية سن تالف أو بعد علاج الجذور، والجسر لتعويض سن مفقود بالاعتماد على الأسنان المجاورة. يحدد الطبيب الأنسب بعد الفحص.' },
        { q: 'هل تنظيف الجير يضعف الأسنان؟', a: 'لا. تنظيف الجير يزيل الترسبات المتراكمة التي قد تسبب التهاب اللثة، ولا يُضعف مينا الأسنان عند إجرائه بشكل صحيح.' },
      ],
      en: [
        { q: 'How often should I have a check-up?', a: 'Roughly every six months is usually recommended, though your dentist may suggest a different interval depending on your teeth and gums.' },
        { q: 'When would I need a crown or bridge?', a: 'A crown protects a damaged tooth or one that has had root canal treatment, and a bridge replaces a missing tooth using the neighbouring teeth. Your dentist will advise after an examination.' },
        { q: 'Does scaling weaken teeth?', a: 'No. Scaling removes hardened deposits that can inflame the gums, and does not weaken enamel when done properly.' },
      ],
    },
    seo: {
      title: { ar: 'كشف الأسنان وتنظيف الجير والتركيبات | عيادات فلوريدا', en: 'Dental Check-ups, Scaling & Crowns | Florida Dental Clinics' },
      description: {
        ar: 'الكشف الدوري وتنظيف الجير والتيجان والجسور والتركيبات المتحركة في عيادات فلوريدا. فروع كفورنجم والإبراهيمية والزقازيق.',
        en: 'Routine check-ups, scaling and polishing, crowns, bridges and dentures at Florida Dental Clinics. Branches in Kafr Negm, Ibrahimia and Zagazig.',
      },
    },
  },
];

/** The seven official categories, in the official order. */
export const mainServices = services.filter((s) => s.main);
/** Additional services kept from the clinic's existing content. */
export const secondaryServices = services.filter((s) => !s.main);
export const getService = (slug: string) => services.find((s) => s.slug === slug);

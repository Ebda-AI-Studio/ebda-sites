// SERVICE SLOT: replace `items` in ar and en with `groups: [[title, [[item, description], ...]], ...]` once Ahmad supplies the list (same shape as sites/marketing). The renderer already supports both.
// DRAFT: Ahmad gave no item list for Events. This copy is a short honest placeholder (no claims, clients or prices).
export default {
  id: 'events',
  name: 'Ebda Events',
  draft: true,
  accent: 'silver',
  ar: {
    tag: 'تنظيم فعاليات',
    h1: 'فعالية مظبوطة من الفكرة لحد يوم الحدث',
    lead: 'قولنا الفعالية اللي في بالك، ونرجعلك بخطة واضحة.',
    angle: 'الصفحة دي لسه مسودة، والتفاصيل الكاملة لخدماتنا هتتضاف قريب.',
    whatTitle: 'بنعمل إيه',
    items: [
      ['تنظيم الفعاليات', 'بنساعدك تنظم فعاليتك من الفكرة للتنفيذ.'],
      ['التفاصيل', 'قائمة الخدمات الكاملة لسه بتتجهز، وهتتنشر هنا أول ما تتأكد.'],
    ],
    howTitle: 'بنشتغل إزاي',
    steps: [
      ['نسمعك', 'بنفهم نوع الفعالية وتاريخها وعدد الحضور المتوقع.'],
      ['نخطط', 'بنرجعلك بخطة واضحة تراجعها وتعدّل عليها.'],
      ['ننفذ', 'بنتابع التنفيذ معاك لحد يوم الحدث.'],
    ],
  },
  en: {
    tag: 'Event organising',
    h1: 'An event that is handled from idea to the day itself',
    lead: 'Tell us the event you have in mind and we will come back with a clear plan.',
    angle: 'This page is a draft. The full list of what we do will be added soon.',
    whatTitle: 'What we do',
    items: [
      ['Event organising', 'We help you organise your event from idea to execution.'],
      ['More detail', 'The full list of services is still being prepared and will be published here once confirmed.'],
    ],
    howTitle: 'How we work',
    steps: [
      ['We listen', 'We learn the type of event, its date and the expected audience.'],
      ['We plan', 'We come back with a clear plan for you to review and adjust.'],
      ['We deliver', 'We follow the execution with you until the day itself.'],
    ],
  },
};

// Renders every page of one sub-brand site. Plain strings, no framework: the output is static HTML.
export const CONTACT_EMAIL = 'ahlan@ebda.app'; // BRAND.supportEmail in ebda-store packages/shared/src/brand/index.ts
const STUDIO = { ar: 'https://ebda.app/', en: 'https://ebda.app/en/' };
const LEGAL = {
  ar: [['الخصوصية', 'https://ebda.app/privacy/'], ['الشروط', 'https://ebda.app/terms/'], ['المعلومات القانونية', 'https://ebda.app/legal/']],
  en: [['Privacy', 'https://ebda.app/en/privacy/'], ['Terms', 'https://ebda.app/en/terms/'], ['Legal', 'https://ebda.app/en/legal/']],
};

/** Page ids, their path under the locale root, and their label in the nav. */
export const PAGES = [
  ['home', ''],
  ['services', 'services/'],
  ['process', 'how-we-work/'],
  ['why', 'why-us/'],
  ['faq', 'faq/'],
  ['contact', 'contact/'],
];
const NAV = {
  ar: { services: 'الخدمات', process: 'بنشتغل إزاي', why: 'ليه إحنا', faq: 'أسئلة شائعة', contact: 'تواصل معانا' },
  en: { services: 'Services', process: 'How we work', why: 'Why us', faq: 'FAQ', contact: 'Contact us' },
};
const UI = {
  ar: {
    dir: 'rtl', other: 'English', otherLang: 'en', skip: 'روح للمحتوى', menu: 'القائمة', navLabel: 'صفحات الموقع',
    illustrative: 'صورة توضيحية', more: 'تفاصيل الخدمات', seeAll: 'كل الخدمات بالتفصيل', process: 'شوف خطوات الشغل',
    why: 'ليه تشتغل معانا', company: 'شركة من ابدأ ستوديو للذكاء الاصطناعي', pages: 'الصفحات', legal: 'قانوني', write: 'راسلنا',
    contactTitle: 'ابعتلنا رسالتك', name: 'اسمك', how: 'رقم موبايلك أو إيميلك', topic: 'الخدمة اللي محتاجها', topicAny: 'لسه مش متأكد',
    msg: 'احكيلنا باختصار عن اللي محتاجه', send: 'جهّز الرسالة', sent: 'رسالتك جاهزة في تطبيق الإيميل. اضغط إرسال من هناك علشان توصلنا.', note: 'الزرار بيفتح تطبيق الإيميل عندك والرسالة جاهزة فيه، وإنت اللي بتبعتها.',
    or: 'ولو حابب تكتب لنا على طول، إيميلنا', required: 'مطلوب', next: 'اللي بيحصل بعد ما تبعت', faqMore: 'سؤالك مش هنا؟',
    faqMoreP: 'ابعتلنا سؤالك وهنرد عليك بنفسنا.', rights: 'كل الحقوق محفوظة',
  },
  en: {
    dir: 'ltr', other: 'العربية', otherLang: 'ar', skip: 'Skip to content', menu: 'Menu', navLabel: 'Site pages',
    illustrative: 'Illustrative image', more: 'Service details', seeAll: 'All services in detail', process: 'See how we work',
    why: 'Why work with us', company: 'An Ebda AI Studio company', pages: 'Pages', legal: 'Legal', write: 'Write to us',
    contactTitle: 'Send us a message', name: 'Your name', how: 'Your phone or email', topic: 'The service you need', topicAny: 'Not sure yet',
    msg: 'Tell us briefly what you need', send: 'Prepare the message', sent: 'Your message is ready in your email app. Press send there for it to reach us.', note: 'The button opens your email app with the message ready; you send it yourself.',
    or: 'If you would rather write directly, our email is', required: 'required', next: 'What happens after you write', faqMore: 'Your question is not here?',
    faqMoreP: 'Send it to us and a person will answer.', rights: 'All rights reserved',
  },
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = (lang, page) => (lang === 'ar' ? '/' : '/en/') + PAGES.find(p => p[0] === page)[1];
// Western digits in every locale (Ruling DIGITS-1); the number carries the order of the steps.
const two = n => String(n + 1).padStart(2, '0');

// Image sizes are fixed by the generated files: heroes 832x1040 (4:5), wide images 1216x832.
function img(name, alt, lang, { hero = false, sizes } = {}) {
  const w = hero ? 832 : 1216;
  const h = hero ? 1040 : 832;
  return `<figure class="ph${hero ? ' ph-hero' : ''}"><img src="/img/${name}-640.webp" srcset="/img/${name}-640.webp 640w, /img/${name}-${w}.webp ${w}w" sizes="${sizes || (hero ? '(min-width: 900px) 40vw, 92vw' : '(min-width: 900px) 50vw, 92vw')}" width="${w}" height="${h}" alt="${esc(alt)}"${hero ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}><figcaption>${esc(UI[lang].illustrative)}</figcaption></figure>`;
}

function header(site, lang, page) {
  const u = UI[lang];
  const name = lang === 'ar' ? site.nameAr : site.nameEn;
  const other = (lang === 'ar' ? '/en/' : '/') + PAGES.find(p => p[0] === page)[1];
  const links = ['services', 'process', 'why', 'faq']
    .map(p => `<li><a href="${href(lang, p)}"${p === page ? ' aria-current="page"' : ''}>${esc(NAV[lang][p])}</a></li>`)
    .join('');
  const lang2 = `<a class="lang" href="${other}" hreflang="${u.otherLang}" lang="${u.otherLang}">${u.other}</a>`;
  return `<header class="bar"><div class="wrap bar-in">
<a class="brand" href="${href(lang, 'home')}"${page === 'home' ? ' aria-current="page"' : ''}><img src="/symbol.svg" alt="" width="34" height="34"><span>${esc(name)}</span></a>
<nav class="nav" aria-label="${u.navLabel}"><ul>${links}</ul></nav>
<div class="bar-end">${lang2}<a class="btn btn-sm" href="${href(lang, 'contact')}"${page === 'contact' ? ' aria-current="page"' : ''}>${esc(NAV[lang].contact)}</a>
<details class="menu"><summary><span class="vh">${u.menu}</span><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary>
<nav aria-label="${u.navLabel}"><ul>${links}<li><a href="${href(lang, 'contact')}">${esc(NAV[lang].contact)}</a></li><li>${lang2}</li></ul></nav></details></div>
</div></header>`;
}

function footer(site, lang) {
  const u = UI[lang];
  const name = lang === 'ar' ? site.nameAr : site.nameEn;
  const pages = PAGES.filter(p => p[0] !== 'home').map(([p]) => `<li><a href="${href(lang, p)}">${esc(NAV[lang][p])}</a></li>`).join('');
  return `<footer class="foot band-dark"><div class="wrap foot-in">
<div class="foot-brand"><p class="foot-name">${esc(name)}</p><p>${esc(site[lang].tagline)}</p><p><a href="${STUDIO[lang]}">${esc(u.company)}</a></p></div>
<div><h2>${u.pages}</h2><ul>${pages}</ul></div>
<div><h2>${u.write}</h2><ul><li><a href="mailto:${CONTACT_EMAIL}" dir="ltr">${CONTACT_EMAIL}</a></li></ul><h2>${u.legal}</h2><ul>${LEGAL[lang].map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
</div><div class="wrap foot-base"><p>© ${new Date().getFullYear()} ${lang === 'ar' ? 'ابدأ ستوديو لتكنولوجيا المعلومات' : 'Ebda Studio'}. ${u.rights}.</p></div></footer>`;
}

/** A labelled band: the label column (an h2) beside the body, the studio home's grid. */
const band = (id, label, body, cls = '') =>
  `<section class="sec${cls ? ` ${cls}` : ''}" aria-labelledby="${id}"><div class="wrap sec-grid"><h2 class="label" id="${id}"><span class="medal" aria-hidden="true"></span>${esc(label)}</h2><div class="sec-body">${body}</div></div></section>`;

const steps = (list, cls = 'steps') =>
  `<ol class="${cls}">${list.map(([t, d], i) => `<li><span class="no" aria-hidden="true">${two(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>`;

const pageHead = (h1, lead, extra = '') =>
  `<section class="page-head"><div class="field" aria-hidden="true"></div><div class="wrap"><h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p>${extra}</div></section>`;

function homePage(site, lang) {
  const c = site[lang];
  const h = c.home;
  const u = UI[lang];
  const groups = c.services.groups
    .map(g => `<li><h3><a href="${href(lang, 'services')}#${g.id}">${esc(g.title)}</a></h3><p>${esc(g.intro)}</p><p class="tags">${g.items.map(([t]) => esc(t)).join('<span aria-hidden="true"> · </span>')}</p></li>`)
    .join('');
  return `<section class="hero" aria-labelledby="h1">
<div class="field" aria-hidden="true"></div>
<div class="wrap hero-in">
<div class="hero-copy"><h1 id="h1">${esc(h.h1)}</h1><p class="lead">${esc(h.lead)}</p>
<p class="actions"><a class="btn btn-lg" href="${href(lang, 'contact')}">${esc(h.cta)}</a><a class="btn btn-ghost btn-lg" href="${href(lang, 'services')}">${esc(u.more)}</a></p></div>
<div class="hero-art">${img(site.images.hero, c.alt.hero, lang, { hero: true })}</div>
</div></section>
${band('h-what', h.whatLabel, `<p class="statement">${esc(h.statement)}</p><ul class="rows">${groups}</ul><p><a class="more" href="${href(lang, 'services')}">${esc(u.seeAll)}</a></p>`)}
${band('h-how', h.flow.label, `<p class="statement">${esc(h.flow.statement)}</p><ol class="flow">${h.flow.items.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol><p><a class="more" href="${href(lang, 'process')}">${esc(u.process)}</a></p>`, 'sec-flow')}
<section class="wide" aria-label="${esc(c.alt.a)}"><div class="wrap">${img(site.images.a, c.alt.a, lang, { sizes: '92vw' })}</div></section>
${band('h-why', h.whyLabel, `<p class="statement">${esc(h.whyStatement)}</p><ul class="trio">${c.why.points.slice(0, 3).map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul><p><a class="more" href="${href(lang, 'why')}">${esc(u.why)}</a></p>`)}
${closer(site, lang)}`;
}

const closer = (site, lang) => {
  const k = site[lang].closer;
  return `<section class="closer" aria-labelledby="cl"><div class="field" aria-hidden="true"></div><div class="wrap closer-in"><h2 id="cl">${esc(k.h)}</h2><p>${esc(k.p)}</p><p class="actions"><a class="btn btn-lg" href="${href(lang, 'contact')}">${esc(NAV[lang].contact)}</a><a class="mail" href="mailto:${CONTACT_EMAIL}" dir="ltr">${CONTACT_EMAIL}</a></p></div></section>`;
};

function servicesPage(site, lang) {
  const c = site[lang];
  const s = c.services;
  const blocks = s.groups
    .map((g, i) => {
      const items = `<dl class="items">${g.items.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>`;
      const pic = i === 1 ? `<div class="inset">${img(site.images.b, c.alt.b, lang)}</div>` : '';
      return `<section class="sec" id="${g.id}" aria-labelledby="g-${g.id}"><div class="wrap sec-grid"><h2 class="label" id="g-${g.id}"><span class="medal" aria-hidden="true"></span>${esc(g.title)}</h2><div class="sec-body"><p class="statement sm">${esc(g.intro)}</p>${items}${pic}</div></div></section>`;
    })
    .join('');
  const jump = `<ul class="jump">${s.groups.map(g => `<li><a href="#${g.id}">${esc(g.title)}</a></li>`).join('')}</ul>`;
  return `${pageHead(s.h1, s.lead, jump)}${blocks}${closer(site, lang)}`;
}

function processPage(site, lang) {
  const c = site[lang];
  const p = c.process;
  return `${pageHead(p.h1, p.lead)}
${band('p-steps', p.stepsLabel, steps(p.steps, 'steps steps-long'))}
${band('p-get', p.getLabel, `<ul class="checks">${p.get.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`)}
<section class="wide" aria-label="${esc(c.alt.b)}"><div class="wrap">${img(site.images.b, c.alt.b, lang, { sizes: '92vw' })}</div></section>
${closer(site, lang)}`;
}

function whyPage(site, lang) {
  const c = site[lang];
  const w = c.why;
  return `${pageHead(w.h1, w.lead)}
${band('w-edge', w.edgeLabel, `<ul class="rows rows-plain">${w.points.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul>`)}
${band('w-not', w.notLabel, `<ul class="checks checks-not">${w.not.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`)}
<section class="wide" aria-label="${esc(c.alt.a)}"><div class="wrap">${img(site.images.a, c.alt.a, lang, { sizes: '92vw' })}</div></section>
${closer(site, lang)}`;
}

function faqPage(site, lang) {
  const c = site[lang];
  const u = UI[lang];
  const qa = c.faq.items.map(([q, a]) => `<details class="qa"><summary><h2>${esc(q)}</h2></summary><p>${esc(a)}</p></details>`).join('');
  return `${pageHead(c.faq.h1, c.faq.lead)}<section class="sec" aria-label="${esc(c.faq.h1)}"><div class="wrap faq">${qa}<div class="faq-more"><h2>${esc(u.faqMore)}</h2><p>${esc(u.faqMoreP)}</p><p><a class="btn" href="${href(lang, 'contact')}">${esc(NAV[lang].contact)}</a></p></div></div></section>`;
}

function contactPage(site, lang) {
  const c = site[lang];
  const u = UI[lang];
  const k = c.contact;
  const subject = `${site.nameEn} enquiry`;
  const topics = [...c.services.groups.filter(g => g.topic !== false).map(g => g.title), u.topicAny].map(t => `<option>${esc(t)}</option>`).join('');
  return `${pageHead(k.h1, k.lead)}
<section class="sec" aria-labelledby="ct"><div class="wrap contact">
<form id="enquiry" class="form" action="mailto:${CONTACT_EMAIL}" method="post" enctype="text/plain" data-to="${CONTACT_EMAIL}" data-subject="${esc(subject)}">
<h2 id="ct">${u.contactTitle}</h2>
<label><span>${esc(u.name)}</span><input name="name" required maxlength="120" autocomplete="name"></label>
<label><span>${esc(u.how)}</span><input name="contact" required maxlength="160" autocomplete="email" dir="ltr" inputmode="email"></label>
<label><span>${esc(u.topic)}</span><select name="topic">${topics}</select></label>
<label><span>${esc(u.msg)}</span><textarea name="message" required rows="5" maxlength="2000"></textarea></label>
<button class="btn btn-lg" type="submit">${esc(u.send)}</button>
<p class="sent" id="sent" role="status" data-msg="${esc(u.sent)}"></p>
<p class="note">${esc(u.note)}</p>
<p class="note">${esc(u.or)} <a href="mailto:${CONTACT_EMAIL}" dir="ltr">${CONTACT_EMAIL}</a></p>
</form>
<aside class="next" aria-labelledby="nx"><h2 id="nx">${u.next}</h2>${steps(k.next)}</aside>
</div></section>`;
}

const BODY = { home: homePage, services: servicesPage, process: processPage, why: whyPage, faq: faqPage, contact: contactPage };

export function renderPage(site, lang, page = 'home') {
  const c = site[lang];
  const u = UI[lang];
  const name = lang === 'ar' ? site.nameAr : site.nameEn;
  const title = page === 'home' ? `${name} | ${c.tagline}` : `${page === 'contact' ? NAV[lang].contact : NAV[lang][page]} | ${name}`;
  const desc = page === 'home' ? c.home.lead : ({ services: c.services.lead, process: c.process.lead, why: c.why.lead, faq: c.faq.lead, contact: c.contact.lead })[page];
  const path = PAGES.find(p => p[0] === page)[1];
  return `<!doctype html>
<html lang="${lang}" dir="${u.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#F5F5F2">
<meta name="color-scheme" content="light">
<link rel="alternate" hreflang="ar" href="/${path}">
<link rel="alternate" hreflang="en" href="/en/${path}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/${lang === 'ar' ? 'plex-ar-500' : 'geist-latin'}.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/site.css">
</head>
<body data-site="${site.id}" data-page="${page}">
<a class="skip" href="#main">${esc(u.skip)}</a>
${header(site, lang, page)}
<main id="main">
${BODY[page](site, lang)}
</main>
${footer(site, lang)}
${page === 'contact' ? '<script src="/contact.js" defer></script>\n' : ''}</body>
</html>
`;
}

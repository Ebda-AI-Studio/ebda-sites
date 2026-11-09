// Renders one sub-brand page. Plain strings, no framework: output is static HTML.
export const CONTACT_EMAIL = 'ahlan@ebda.app'; // BRAND.supportEmail in ebda-store packages/shared/src/brand/index.ts

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const UI = {
  ar: {
    dir: 'rtl', other: 'English', otherHref: 'en/', cta: 'تواصل معانا', skip: 'تخطي إلى المحتوى',
    draft: 'مسودة للمراجعة: النص ده مؤقت لحد ما يتأكد.',
    contactTitle: 'احكيلنا عن اللي محتاجه',
    contactLead: 'اكتب لنا باختصار وهنرد عليك.',
    name: 'الاسم', how: 'رقم الموبايل أو الإيميل', msg: 'محتاج إيه؟', send: 'ابعت الرسالة',
    note: 'الزرار بيفتح تطبيق الإيميل عندك برسالة جاهزة.', or: 'أو راسلنا مباشرة على',
    footer: 'شركة من ابدأ ستوديو للذكاء الاصطناعي', studio: 'An Ebda AI Studio company',
  },
  en: {
    dir: 'ltr', other: 'العربية', otherHref: '../', cta: 'Contact us', skip: 'Skip to content',
    draft: 'DRAFT for review: this text is a placeholder until confirmed.',
    contactTitle: 'Tell us what you need',
    contactLead: 'Write a few lines and we will reply.',
    name: 'Name', how: 'Phone or email', msg: 'What do you need?', send: 'Send message',
    note: 'The button opens your email app with the message ready.', or: 'Or write to us directly at',
    footer: 'An Ebda AI Studio company', studio: '',
  },
};

export function renderPage(site, lang) {
  const c = site[lang];
  const u = UI[lang];
  const root = lang === 'ar' ? '' : '../';
  const subject = `${site.name} enquiry`;
  const item = (t, d, h) => `<li><${h}>${esc(t)}</${h}><p>${esc(d)}</p></li>`;
  const what = c.groups
    ? c.groups.map(([g, its]) => `<h3 class="gh">${esc(g)}</h3><ul class="grid">${its.map(([t, d]) => item(t, d, 'h4')).join('')}</ul>`).join('')
    : `<ul class="grid">${c.items.map(([t, d]) => item(t, d, 'h3')).join('')}</ul>`;
  const steps = c.steps.map(([t, d], i) => `<li><span class="n" aria-hidden="true">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('');
  const draft = site.draft ? `<p class="draft" role="note">${esc(u.draft)}</p>` : '';
  return `<!doctype html>
<html lang="${lang}" dir="${u.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.name)} | ${esc(c.tag)}</title>
<meta name="description" content="${esc(c.lead)}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0A0B0C">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}site.css">
</head>
<body data-accent="${site.accent}">
<a class="skip" href="#main">${esc(u.skip)}</a>
<header class="bar">
<a class="brand" href="${lang === 'ar' ? './' : './'}"><img src="${root}symbol.svg" alt="" width="32" height="32"><span>${esc(site.name)}</span></a>
<nav aria-label="${lang === 'ar' ? 'اللغة والتواصل' : 'Language and contact'}"><a href="${u.otherHref}" hreflang="${lang === 'ar' ? 'en' : 'ar'}" lang="${lang === 'ar' ? 'en' : 'ar'}">${u.other}</a><a class="btn sm" href="#contact">${esc(u.cta)}</a></nav>
</header>
<main id="main">
${draft}
<section class="hero">
<p class="eyebrow">${esc(c.tag)}</p>
<h1>${esc(c.h1)}</h1>
<p class="lead">${esc(c.lead)}</p>
<p class="angle">${esc(c.angle)}</p>
<a class="btn" href="#contact">${esc(u.cta)}</a>
</section>
<section aria-labelledby="what">
<h2 id="what">${esc(c.whatTitle)}</h2>
${what}
</section>
<section aria-labelledby="how">
<h2 id="how">${esc(c.howTitle)}</h2>
<ol class="steps">${steps}</ol>
</section>
<section id="contact" aria-labelledby="ct" class="contact">
<h2 id="ct">${esc(u.contactTitle)}</h2>
<p>${esc(u.contactLead)}</p>
<form id="enquiry" action="mailto:${CONTACT_EMAIL}" method="post" enctype="text/plain" data-to="${CONTACT_EMAIL}" data-subject="${esc(subject)}">
<label>${esc(u.name)}<input name="name" required maxlength="120" autocomplete="name"></label>
<label>${esc(u.how)}<input name="contact" required maxlength="160" autocomplete="email" dir="ltr"></label>
<label>${esc(u.msg)}<textarea name="message" required rows="4" maxlength="2000"></textarea></label>
<button class="btn" type="submit">${esc(u.send)}</button>
<p class="note">${esc(u.note)} ${esc(u.or)} <a href="mailto:${CONTACT_EMAIL}" dir="ltr">${CONTACT_EMAIL}</a></p>
</form>
</section>
</main>
<footer><p>${esc(u.footer)}</p>${u.studio ? `<p lang="en" dir="ltr">${esc(u.studio)}</p>` : ''}</footer>
<script src="${root}contact.js" defer></script>
</body>
</html>
`;
}

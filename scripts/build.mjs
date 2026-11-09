import { mkdirSync, writeFileSync, copyFileSync, rmSync, readdirSync } from 'node:fs';
import { renderPage, PAGES } from '../lib/render.mjs';
import { latticeSvg, medalSvg } from '../lib/geometry.mjs';

const ids = ['events', 'marketing', 'design'];
// Hidden previews: every response is noindex; CSP forbids inline script/style. Fonts and images are self-hosted.
const HEADERS = `/*
  X-Robots-Tag: noindex, nofollow
  Content-Security-Policy: default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'; script-src 'self'; form-action mailto:; base-uri 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Cache-Control: public, max-age=300
`;
rmSync('dist', { recursive: true, force: true });
const fonts = readdirSync('assets/fonts');
for (const id of ids) {
  const site = (await import(`../sites/${id}/content.mjs`)).default;
  const out = `dist/${id}`;
  for (const lang of ['ar', 'en'])
    for (const [page, path] of PAGES) {
      const dir = `${out}/${lang === 'ar' ? '' : 'en/'}${path}`;
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}index.html`, renderPage(site, lang, page));
    }
  mkdirSync(`${out}/fonts`, { recursive: true });
  mkdirSync(`${out}/img`, { recursive: true });
  for (const f of fonts) copyFileSync(`assets/fonts/${f}`, `${out}/fonts/${f}`);
  // only this site's own photographs ship with it
  for (const f of readdirSync('assets/img').filter(f => Object.values(site.images).some(n => f.startsWith(`${n}-`))))
    copyFileSync(`assets/img/${f}`, `${out}/img/${f}`);
  writeFileSync(`${out}/lattice.svg`, latticeSvg(id));
  writeFileSync(`${out}/medal.svg`, medalSvg(id));
  copyFileSync('lib/site.css', `${out}/site.css`);
  copyFileSync('lib/contact.js', `${out}/contact.js`);
  copyFileSync('assets/symbol.svg', `${out}/symbol.svg`);
  copyFileSync('assets/favicon.svg', `${out}/favicon.svg`);
  writeFileSync(`${out}/robots.txt`, 'User-agent: *\nDisallow: /\n');
  writeFileSync(`${out}/_headers`, HEADERS);
}
console.log('built', ids.join(', '), `(${PAGES.length} pages x 2 languages each)`);

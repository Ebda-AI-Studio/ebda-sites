import { mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { renderPage } from '../lib/render.mjs';

const ids = ['events', 'marketing', 'design'];
// Hidden previews: every response is noindex; CSP forbids inline script/style.
const HEADERS = `/*
  X-Robots-Tag: noindex, nofollow
  Content-Security-Policy: default-src 'none'; img-src 'self'; style-src 'self'; script-src 'self'; form-action mailto:; base-uri 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Cache-Control: public, max-age=300
`;
rmSync('dist', { recursive: true, force: true });
for (const id of ids) {
  const site = (await import(`../sites/${id}/content.mjs`)).default;
  const out = `dist/${id}`;
  mkdirSync(`${out}/en`, { recursive: true });
  writeFileSync(`${out}/index.html`, renderPage(site, 'ar'));
  writeFileSync(`${out}/en/index.html`, renderPage(site, 'en'));
  copyFileSync('lib/site.css', `${out}/site.css`);
  copyFileSync('lib/contact.js', `${out}/contact.js`);
  copyFileSync('assets/symbol.svg', `${out}/symbol.svg`);
  copyFileSync('assets/favicon.svg', `${out}/favicon.svg`);
  writeFileSync(`${out}/robots.txt`, 'User-agent: *\nDisallow: /\n');
  writeFileSync(`${out}/_headers`, HEADERS);
}
console.log('built', ids.join(', '));

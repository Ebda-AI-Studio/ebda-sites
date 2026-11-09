import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const ids = ['events', 'marketing', 'design'];
const pages = id => [`dist/${id}/index.html`, `dist/${id}/en/index.html`];

for (const id of ids) {
  test(`${id}: hidden (noindex everywhere, no sitemap)`, () => {
    assert.match(readFileSync(`dist/${id}/_headers`, 'utf8'), /X-Robots-Tag: noindex, nofollow/);
    assert.equal(readFileSync(`dist/${id}/robots.txt`, 'utf8'), 'User-agent: *\nDisallow: /\n');
    assert.ok(!readdirSync(`dist/${id}`).some(f => /sitemap/i.test(f)));
    for (const p of pages(id)) assert.match(readFileSync(p, 'utf8'), /<meta name="robots" content="noindex, nofollow">/);
  });
  test(`${id}: doctype, lang/dir, CSP-safe markup`, () => {
    const [ar, en] = pages(id).map(p => readFileSync(p, 'utf8'));
    for (const h of [ar, en]) {
      assert.ok(h.toLowerCase().startsWith('<!doctype html>'));
      assert.doesNotMatch(h, /\sstyle="|\son[a-z]+="|<script(?![^>]*\ssrc=)/);
    }
    assert.match(ar, /<html lang="ar" dir="rtl">/);
    assert.match(en, /<html lang="en" dir="ltr">/);
    assert.match(ar, /شركة من ابدأ ستوديو/);
    assert.match(en, /An Ebda AI Studio company/);
  });
  test(`${id}: no orange, no provider names`, () => {
    const css = readFileSync(`dist/${id}/site.css`, 'utf8');
    assert.doesNotMatch(css, /#ff6e01|orange/i);
    for (const p of pages(id)) assert.doesNotMatch(readFileSync(p, 'utf8'), /force ?ai|openai|anthropic|claude|gemini|cloudflare/i);
  });
}
test('events is flagged as a draft, others are not', () => {
  assert.match(readFileSync('dist/events/index.html', 'utf8'), /class="draft"/);
  assert.doesNotMatch(readFileSync('dist/marketing/index.html', 'utf8'), /class="draft"/);
  assert.ok(existsSync('dist/design/index.html'));
});
test('no site is wired to a route or custom domain', () => {
  for (const id of ids) {
    const w = readFileSync(`sites/${id}/wrangler.jsonc`, 'utf8');
    assert.doesNotMatch(w, /"routes?"|custom_domain|ebda\.app/);
    assert.match(w, /"workers_dev": true/);
  }
});

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
test('each site has only its own preview-host route, gated by the worker', () => {
  for (const id of ids) {
    const w = readFileSync(`sites/${id}/wrangler.jsonc`, 'utf8');
    assert.doesNotMatch(w, /custom_domain/);
    assert.deepEqual([...w.matchAll(/"pattern": "([^"]+)"/g)].map(m => m[1]), [`preview-${id}.ebda.app/*`]);
    assert.match(w, /"run_worker_first": true/);
    assert.match(w, /"workers_dev": true/);
  }
});

test('worker fails closed without the secret and gates every request', async () => {
  const { default: w } = await import('../lib/worker.mjs');
  const env = { ASSETS: { fetch: async () => new Response('ok') } };
  const r = await w.fetch(new Request('https://x/'), env);
  assert.equal(r.status, 401);
  assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(await r.text(), 'Unauthorized');
  const auth = p => ({ headers: { Authorization: 'Basic ' + btoa('ebda:' + p) } });
  assert.equal((await w.fetch(new Request('https://x/', auth('pw')), { ...env, PREVIEW_PASSWORD: 'pw' })).status, 200);
  assert.equal((await w.fetch(new Request('https://x/', auth('no')), { ...env, PREVIEW_PASSWORD: 'pw' })).status, 401);
  assert.equal((await w.fetch(new Request('https://x/', auth('')), env)).status, 401);
});

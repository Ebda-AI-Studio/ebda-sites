import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { PAGES } from '../lib/render.mjs';

const ids = ['events', 'marketing', 'design'];
const pages = id => PAGES.flatMap(([, p]) => [`dist/${id}/${p}index.html`, `dist/${id}/en/${p}index.html`]);
const read = p => readFileSync(p, 'utf8');

for (const id of ids) {
  test(`${id}: every page exists in both languages`, () => {
    assert.equal(pages(id).length, 12);
    for (const p of pages(id)) assert.ok(existsSync(p), p);
  });
  test(`${id}: hidden (noindex everywhere, no sitemap)`, () => {
    assert.match(read(`dist/${id}/_headers`), /X-Robots-Tag: noindex, nofollow/);
    assert.equal(read(`dist/${id}/robots.txt`), 'User-agent: *\nDisallow: /\n');
    assert.ok(!readdirSync(`dist/${id}`).some(f => /sitemap/i.test(f)));
    for (const p of pages(id)) assert.match(read(p), /<meta name="robots" content="noindex, nofollow">/);
  });
  test(`${id}: doctype, lang/dir, CSP-safe markup`, () => {
    for (const p of pages(id)) {
      const h = read(p);
      assert.ok(h.toLowerCase().startsWith('<!doctype html>'), p);
      assert.doesNotMatch(h, /\sstyle="|\son[a-z]+="|<script(?![^>]*\ssrc=)/, p);
      assert.match(h, p.includes('/en/') ? /<html lang="en" dir="ltr">/ : /<html lang="ar" dir="rtl">/, p);
      assert.match(h, p.includes('/en/') ? /An Ebda AI Studio company/ : /شركة من ابدأ ستوديو/, p);
    }
  });
  test(`${id}: no orange, no provider or internal names, no draft banner`, () => {
    const css = read(`dist/${id}/site.css`);
    assert.doesNotMatch(css, /#ff6e01|orange/i);
    for (const p of pages(id)) {
      const h = read(p);
      assert.doesNotMatch(h, /force ?ai|openai|anthropic|claude|gemini|cloudflare|workers|leonardo|flux|midjourney|whisky/i, p);
      assert.doesNotMatch(h, /class="draft"|DRAFT|مسودة/, p);
    }
  });
  test(`${id}: legal footer links to ebda.app, contact goes to the studio address`, () => {
    for (const p of pages(id)) {
      const h = read(p);
      const en = p.includes('/en/');
      for (const l of ['privacy', 'terms', 'legal']) assert.ok(h.includes(`href="https://ebda.app/${en ? 'en/' : ''}${l}/"`), `${p} ${l}`);
      assert.match(h, /mailto:ahlan@ebda\.app/);
    }
    const c = read(`dist/${id}/contact/index.html`);
    assert.match(c, /<form id="enquiry"[^>]*data-to="ahlan@ebda\.app"/);
    assert.match(c, /<script src="\/contact\.js" defer><\/script>/);
  });
  test(`${id}: every image is self-hosted, sized, described and labelled illustrative`, () => {
    for (const p of pages(id)) {
      const h = read(p);
      for (const [tag] of h.matchAll(/<img [^>]+>/g)) {
        assert.match(tag, /width="\d+" height="\d+"/, tag);
        assert.match(tag, /alt="/, tag);
        for (const [, src] of tag.matchAll(/(?:src|srcset)="([^"]+)"/g))
          for (const u of src.split(',').map(s => s.trim().split(' ')[0])) assert.ok(existsSync(`dist/${id}${u}`), `${p} ${u}`);
      }
      assert.equal((h.match(/<figure class="ph/g) || []).length, (h.match(/<figcaption>/g) || []).length);
    }
  });
  test(`${id}: lattice has no {6/2} star (Ruling MKT-NO-HEXAGRAM-1)`, () => {
    for (const f of ['lattice.svg', 'medal.svg']) {
      const svg = read(`dist/${id}/${f}`);
      for (const [, d] of svg.matchAll(/ d="([^"]+)"/g)) {
        const n = d.split(/[ML]/).filter(Boolean).length;
        assert.ok(![3, 6, 12].includes(n), `${f}: path with ${n} vertices`);
      }
    }
  });
}

test('events: weddings appear only as support services, never as a headline event type', async () => {
  const site = (await import('../sites/events/content.mjs')).default;
  for (const lang of ['ar', 'en']) {
    const [first] = site[lang].services.groups;
    assert.doesNotMatch(JSON.stringify(first) + site[lang].home.h1 + site[lang].home.lead, /wedding|birthday|فرح|أفراح|عيد ميلاد/i);
    assert.ok(site[lang].services.groups.some(g => g.id === 'support'));
  }
});

test('each site has only its own preview-host route, gated by the worker', () => {
  for (const id of ids) {
    const w = read(`sites/${id}/wrangler.jsonc`);
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

// Gate for hidden previews: HTTP Basic Auth on every request, noindex on every response.
const HIDE = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' };

async function digest(s) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
}
async function same(a, b) {
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

export default {
  async fetch(request, env) {
    const pass = env.PREVIEW_PASSWORD;
    const given = request.headers.get('Authorization') || '';
    // Fail closed: an unset secret denies everyone.
    if (!pass || !(await same(given, `Basic ${btoa(`ebda:${pass}`)}`))) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { ...HIDE, 'WWW-Authenticate': 'Basic realm="preview", charset="UTF-8"', 'Content-Type': 'text/plain' },
      });
    }
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(HIDE)) out.headers.set(k, v);
    return out;
  },
};

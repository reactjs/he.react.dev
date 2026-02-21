import fs from 'fs';
import path from 'path';

const dir = 'src/content/learn';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

const cachePath = 'scripts/.translate-cache-learn.json';
const cache = new Map(
  fs.existsSync(cachePath)
    ? Object.entries(JSON.parse(fs.readFileSync(cachePath, 'utf8')))
    : []
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hasEnglish(line) {
  return /[A-Za-z]{2,}/.test(line);
}

async function translateText(text) {
  const input = text.trim();
  if (!input) return text;
  if (cache.has(input)) return text.replace(input, cache.get(input));

  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=he&dt=t&q=' + encodeURIComponent(input);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json,text/plain,*/*',
    },
  });
  if (!res.ok) throw new Error('translate failed: ' + res.status);
  const data = await res.json();
  const out = (data?.[0] || []).map((x) => x?.[0] || '').join('');
  cache.set(input, out || input);
  await sleep(10);
  return text.replace(input, out || input);
}

for (const f of files) {
  const p = path.join(dir, f);
  const src = fs.readFileSync(p, 'utf8');
  const lines = src.split(/\r?\n/);

  let inCode = false;
  let inFrontmatter = false;
  let frontmatterSeen = false;
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.trim() === '```' || line.trim().startsWith('```')) {
      inCode = !inCode;
      continue;
    }

    if (!frontmatterSeen && line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      if (!inFrontmatter) frontmatterSeen = true;
      continue;
    }

    if (inCode) continue;

    // Frontmatter: translate title when contains English
    if (inFrontmatter) {
      const m = line.match(/^(title:\s*)(.+)$/);
      if (m && hasEnglish(m[2])) {
        const raw = m[2].trim();
        const unquoted = raw.replace(/^['\"]|['\"]$/g, '');
        const translated = await translateText(unquoted);
        lines[i] = `${m[1]}${JSON.stringify(translated.trim())}`;
        changed = true;
      }
      continue;
    }

    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('<') || t.startsWith('</') || t.startsWith('{/*')) continue;
    if (t.startsWith('> ')) {
      // translate blockquotes too
    }

    // avoid touching lines that are mostly syntax/code/table separators
    if (/^\|?\s*[-:|`]+\s*$/.test(t)) continue;
    if (t.includes('```')) continue;

    if (!hasEnglish(t)) continue;

    try {
      const translatedLine = await translateText(line);
      if (translatedLine !== line) {
        lines[i] = translatedLine;
        changed = true;
      }
    } catch (e) {
      // keep going on per-line failure
    }
  }

  if (changed) {
    fs.writeFileSync(p, lines.join('\n'));
    console.log('updated', p);
  }
}

fs.writeFileSync(
  cachePath,
  JSON.stringify(Object.fromEntries(cache), null, 2)
);

console.log('done');

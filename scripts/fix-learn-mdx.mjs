import fs from 'fs';
import path from 'path';

const dir = 'src/content/learn';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

function slugifyId(raw) {
  return raw
    .normalize('NFKD')
    .replace(/["'`]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

for (const f of files) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, 'utf8');
  const original = s;

  // Normalize malformed heading anchor comments.
  s = s.replace(/\{\/\*([^*]*?)\*\/\}/g, (m, id) => `{/*${slugifyId(id)}*/}`);

  // Handle broken duplicated heading line fragments like "{/...* {/*...*/}".
  s = s.replace(/\{\/[^{\n]*\{\/\*([^*]*?)\*\/\}/g, (_m, id) => `{/*${slugifyId(id)}*/}`);

  // Normalize all heading ids in comments everywhere.
  s = s.replace(/\{\/\*([^*]+)\*\/\}/g, (_m, id) => `{/*${slugifyId(id)}*/}`);

  // In prose, raw html tag mentions should be inline-code, not actual HTML.
  // Avoid touching real JSX/MDX component lines that start with <
  const lines = s.split(/\r?\n/);
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const t = line.trim();
    if (t.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (t.startsWith('<') || t.startsWith('</')) continue;

    line = line
      .replace(/<(input|button|div|span|h1|h2|h3|p|li|ul|ol|section|nav|img)>/g, '`<$1>`')
      .replace(/<\/(input|button|div|span|h1|h2|h3|p|li|ul|ol|section|nav|img)>/g, '`</$1>`');

    // Fix common broken quote pattern around inline tags after translation.
    line = line.replace(/-`<(input|button)>`'/g, '-`<$1>`');
    line = line.replace(/-<(input|button)>'/g, '-`<$1>`');

    // Avoid literal curly braces in prose that break MDX expressions.
    if (/\*\*.*\{.*\*\*/.test(line) && !line.includes('`{`')) {
      line = line.replace(/\{/g, '`{`').replace(/\}/g, '`}`');
    }

    lines[i] = line;
  }
  s = lines.join('\n');

  // Targeted fix for known broken heading in reacting-to-input-with-state.
  if (f === 'reacting-to-input-with-state.md') {
    s = s.replace(
      /^### .*set-state.*$/m,
      '### שלב 5: חברו את מטפלי האירועים לעדכון מצב {/*step-5-connect-the-event-handlers-to-set-state*/}'
    );
  }

  if (s !== original) {
    fs.writeFileSync(p, s);
    console.log('fixed', p);
  }
}

console.log('done');

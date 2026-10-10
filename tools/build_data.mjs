import fs from 'fs';
import path from 'path';

const SRC = '/tmp/shamela_mojam.txt';
const OUT = '/mujam-al-buldan/data';

const LETTER_FILE = {
  'الهمزة': 'A', 'الباء': 'B', 'التاء': 'T', 'الثاء': 'TH', 'الجيم': 'J',
  'الحاء': 'H', 'الخاء': 'KH', 'الدال': 'D', 'الذال': 'DH', 'الراء': 'R',
  'الزاي': 'Z', 'السين': 'S', 'الشين': 'SH', 'الصاد': 'S2', 'الضاد': 'D2',
  'الطاء': 'T2', 'الظاء': 'Z2', 'العين': 'E', 'الغين': 'GH', 'الفاء': 'F',
  'القاف': 'Q', 'الكاف': 'K', 'اللام': 'L', 'الميم': 'M', 'النون': 'N',
  'الهاء': 'H2', 'الواو': 'W', 'الياء': 'Y'
};

function detectBookLetter(name) {
  const tokens = name.split(/\s+/);
  for (const t of tokens) {
    if (LETTER_FILE[t]) return LETTER_FILE[t];
  }
  return null;
}

function firstFileChar(word) {
  const clean = word.replace(/[\u064B-\u065F\u0670]/g, '');
  if (!clean) return null;
  const ch = clean[0];
  const map = {
    'أ': 'A', 'إ': 'A', 'آ': 'A', 'ا': 'A', 'ب': 'B', 'ت': 'T', 'ث': 'TH',
    'ج': 'J', 'ح': 'H', 'خ': 'KH', 'د': 'D', 'ذ': 'DH', 'ر': 'R', 'ز': 'Z',
    'س': 'S', 'ش': 'SH', 'ص': 'S2', 'ض': 'D2', 'ط': 'T2', 'ظ': 'Z2',
    'ع': 'E', 'غ': 'GH', 'ف': 'F', 'ق': 'Q', 'ك': 'K', 'ل': 'L', 'م': 'M',
    'ن': 'N', 'هـ': 'H2', 'ه': 'H2', 'و': 'W', 'ي': 'Y'
  };
  return map[ch] || null;
}

function classifyText(body) {
  const t = body.replace(/\s+/g, ' ');
  const patterns = [
    [/^(بحر|هذه? ?البحيرة|بحيرة|غدرة)[ :]/, 'بحر/بحيرة'],
    [/^(جبل|جبال)[ :]/, 'جبل'],
    [/^(نهر|أنهار)[ :]/, 'نهر'],
    [/^(وادي|أودية)[ :]/, 'وادي'],
    [/^(حصن|قلعة)[ :]/, 'حصن/قلعة'],
    [/^(قرية|قرى)[ :]/, 'قرية'],
    [/^(كورة)[ :]/, 'كورة'],
    [/^(مدينة|مصر)[ :]/, 'مدينة'],
    [/^(بليدة)[ :]/, 'بليدة'],
    [/^(ماء|مياه|عين)[ :]/, 'ماء/عين'],
    [/^(سوق|أسواق)[ :]/, 'سوق'],
    [/^(جزر?|جزائر)[ :]/, 'جزيرة'],
    [/^(دير|أديرة)[ :]/, 'دير'],
    [/^(مسجد|جامع)[ :]/, 'مسجد'],
    [/^(فم|ناحية|بلدة|اعمال)[ :]/, 'موضع'],
  ];
  for (const [re, label] of patterns) if (re.test(t)) return label;
  return 'موضع جغرافي';
}

function cleanLines(rawLines) {
  const out = [];
  for (let ln of rawLines) {
    ln = ln.trim();
    if (!ln.startsWith('#') && !ln.startsWith('~~')) continue;
    ln = ln.replace(/^~~\s*/, '');
    ln = ln.replace(/^#\s*/, '');
    if (/^(\d{1,4}\s*)?PageV\d+P\d+\s*$/.test(ln)) continue;
    if (/PageV\d+P\d+/.test(ln) && /^\d+/.test(ln)) continue;
    if (ln.includes('طريقة النقل') || ln.includes('نهاية الصفحة')) continue;
    out.push(ln);
  }
  return out.join('\n')
    .replace(/%~%/g, '\n')
    .replace(/\bms\d+\b/g, ' ')
    .replace(/PageV\d+P\d+/g, ' ')
    .replace(/\s*QS\d+V\d+\s*/g, ' ')
    .replace(/[ \t\u00A0]+/g, ' ')
    .replace(/\n +/g, '\n')
    .replace(/^\s*|\s*$/g, '')
    .replace(/\n{3,}/g, '\n\n');
}

const text = fs.readFileSync(SRC, 'utf8');
const lines = text.split('\n');

let inMeta = false;
let dbgEnt = 0;
let currentFile = null;   // book letter of enclosing باب
let cur = null;           // {title, bodyRaw}
const buckets = {};
const master = [];
let dbg = { inMeta: 0, skipEmpty: 0, bab: 0, ent: 0, hdr: 0, other: 0 };

function finalize() {
  if (!cur) return;
  const body = cleanLines(cur.bodyRaw);
  const title = cur.title.replace(/\s+/g, ' ').trim();
  if (title && title !== 'حرف' && title.startsWith('$$') === false) {
    if (body.length >= 15) {
      const file = cur.file;
      const id = `mujam_${master.length + 1}`;
      const type = classifyText(body);
      buckets[file] = buckets[file] || [];
      buckets[file].push({ id, name: title, type, text: body });
      master.push({ id, name: title, file, type });
    }
  }
  cur = null;
}

for (const line of lines) {
  if (line.startsWith('#META#Header#End#')) { inMeta = false; continue; }
  if (line.startsWith('#META#')) { dbg.inMeta++; inMeta = true; continue; }
  if (inMeta || line === '######OpenITI#' || line.trim() === '') { dbg.skipEmpty++; continue; }

  const bab = line.match(/^### \|\| (.+)$/);
  if (bab) {
    dbg.bab++;
    finalize();
    const l = detectBookLetter(bab[1]);
    if (l) currentFile = l;
    continue;
  }
  const ent = line.match(/^### \|\|\| \$ (.*)$/);
  if (ent) { dbg.ent++;
    finalize();
    const rest = ent[1].trim();
    const colon = rest.indexOf(':');
    let title, body = '';
    if (colon >= 0) { title = rest.slice(0, colon).trim(); body = rest.slice(colon + 1).trim(); }
    else title = rest;
    cur = { title, file: currentFile || firstFileChar(title), bodyRaw: body ? [body] : [] };
    continue;
  }
  if (/^### \|/.test(line) || /^####/.test(line)) {
    dbg.hdr++;
    finalize();
    continue;
  }
  dbg.other++;
  if (cur) cur.bodyRaw.push(line);
}

finalize();

console.error('DBG', JSON.stringify(dbg));

fs.mkdirSync(OUT, { recursive: true });
const ORDER = Object.fromEntries(Object.entries(LETTER_FILE).map(([k, v]) => [v, true]));
for (const [code, items] of Object.entries(buckets)) {
  fs.writeFileSync(path.join(OUT, `${code}.json`), JSON.stringify(items, null, 1));
  console.log(`${code}.json  ${items.length}`);
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(master, null, 1));
console.log('TOTAL entries:', master.length);
import { vocabulary, type Word } from '../data/vocabulary';

export type Token = { type: 'word'; word: Word } | { type: 'text'; text: string };

const MAX_MATCH = 10;
const MIN_KANA_MATCH = 2;

let _maps: { byKanji: Map<string, Word>; byKana: Map<string, Word> } | null = null;

function getMaps() {
  if (!_maps) {
    const byKanji = new Map<string, Word>();
    const byKana = new Map<string, Word>();
    for (const w of vocabulary) {
      if (!byKanji.has(w.kanji)) byKanji.set(w.kanji, w);
      if (!byKana.has(w.kana)) byKana.set(w.kana, w);
    }
    _maps = { byKanji, byKana };
  }
  return _maps;
}

export function tokenize(text: string): Token[] {
  const { byKanji, byKana } = getMaps();
  const result: Token[] = [];
  let i = 0;

  while (i < text.length) {
    const maxLen = Math.min(MAX_MATCH, text.length - i);
    let matched = false;

    for (let len = maxLen; len >= 1; len--) {
      const substr = text.slice(i, i + len);
      const w = byKanji.get(substr) ?? (len >= MIN_KANA_MATCH ? byKana.get(substr) : undefined);
      if (w) {
        result.push({ type: 'word', word: w });
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const last = result.at(-1);
      if (last?.type === 'text') {
        last.text += text[i];
      } else {
        result.push({ type: 'text', text: text[i] });
      }
      i++;
    }
  }

  return result;
}

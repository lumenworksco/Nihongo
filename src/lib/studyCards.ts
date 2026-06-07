import { vocabulary, type Word } from '../data/vocabulary';
import { grammarPoints } from '../data/grammar';
import { particles } from '../data/particles';
import { cltCards } from '../data/clt';
import { kanaEntries } from '../data/kana';
import { kanjiEntries } from '../data/kanji';
import type { StudyCard } from './srs';

const typeLabels: Record<Word['type'], string> = {
  noun: 'noun', verb: 'verb',
  'adjective-i': 'い-adj', 'adjective-na': 'な-adj',
  adverb: 'adv', expression: 'expr',
};

export function buildVocabCards(): StudyCard[] {
  return vocabulary.flatMap(w => [
    {
      cardKey: `v:${w.id}:j`,
      deckId: 'vocabulary',
      direction: 'jp-en' as const,
      front: { primary: w.kanji, secondary: w.kana, tag: typeLabels[w.type] },
      back: { primary: w.meaning, secondary: w.romaji, example: w.example },
    },
    {
      cardKey: `v:${w.id}:e`,
      deckId: 'vocabulary',
      direction: 'en-jp' as const,
      front: { primary: w.meaning, tag: typeLabels[w.type] },
      back: { primary: w.kanji, secondary: `${w.kana} · ${w.romaji}`, example: w.example },
    },
  ]);
}

export function buildGrammarCards(): StudyCard[] {
  return grammarPoints.flatMap(g => [
    {
      cardKey: `g:${g.id}:j`,
      deckId: 'grammar',
      direction: 'jp-en' as const,
      front: { primary: g.pattern, secondary: g.romaji },
      back: { primary: g.meaning, detail: g.structure, example: g.examples[0] },
    },
    {
      cardKey: `g:${g.id}:e`,
      deckId: 'grammar',
      direction: 'en-jp' as const,
      front: { primary: g.meaning, tag: g.level },
      back: { primary: g.pattern, secondary: g.romaji, detail: g.structure, example: g.examples[0] },
    },
  ]);
}

export function buildCLTCards(): StudyCard[] {
  return cltCards.flatMap(c => [
    {
      cardKey: `clt:${c.id}:j`,
      deckId:  'clt',
      direction: 'jp-en' as const,
      front: { primary: c.jp, secondary: c.romaji, tag: c.note },
      back:  { primary: c.meaning, secondary: c.note },
    },
    {
      cardKey: `clt:${c.id}:e`,
      deckId:  'clt',
      direction: 'en-jp' as const,
      front: { primary: c.meaning },
      back:  { primary: c.jp, secondary: c.romaji, detail: c.note },
    },
  ]);
}

export function buildKanaCards(): StudyCard[] {
  return kanaEntries.flatMap(k => [
    {
      cardKey: `kana:h:${k.id}`,
      deckId: 'kana',
      direction: 'jp-en' as const,
      front: { primary: k.hiragana },
      back: { primary: k.romaji, secondary: k.katakana },
    },
    {
      cardKey: `kana:k:${k.id}`,
      deckId: 'kana',
      direction: 'en-jp' as const,
      jpFront: true,
      front: { primary: k.katakana },
      back: { primary: k.romaji, secondary: k.hiragana },
    },
  ]);
}

export function buildKanjiCards(): StudyCard[] {
  return kanjiEntries.flatMap(k => [
    {
      cardKey: `kanji:${k.id}:j`,
      deckId: 'kanji',
      direction: 'jp-en' as const,
      front: { primary: k.kanji },
      back: {
        primary: k.meanings.join(', '),
        secondary: [k.onyomi.join('・'), k.kunyomi.join('・')].filter(Boolean).join('  ·  '),
      },
    },
    {
      cardKey: `kanji:${k.id}:e`,
      deckId: 'kanji',
      direction: 'en-jp' as const,
      front: { primary: k.meanings.join(', ') },
      back: {
        primary: k.kanji,
        secondary: [k.onyomi.join('・'), k.kunyomi.join('・')].filter(Boolean).join('  ·  '),
      },
    },
  ]);
}

export function buildParticleCards(): StudyCard[] {
  return particles.flatMap(p => [
    {
      cardKey: `p:${p.particle}:j`,
      deckId: 'particles',
      direction: 'jp-en' as const,
      front: { primary: p.particle, secondary: p.romaji },
      back: { primary: p.name, detail: p.usages[0]?.explanation, example: p.usages[0]?.examples[0] },
    },
    {
      cardKey: `p:${p.particle}:e`,
      deckId: 'particles',
      direction: 'en-jp' as const,
      front: { primary: p.name },
      back: { primary: p.particle, secondary: `(${p.romaji})`, detail: p.usages[0]?.explanation, example: p.usages[0]?.examples[0] },
    },
  ]);
}

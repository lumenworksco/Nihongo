import { vocabulary, type Word } from '../data/vocabulary';
import { grammarPoints } from '../data/grammar';
import { particles } from '../data/particles';
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

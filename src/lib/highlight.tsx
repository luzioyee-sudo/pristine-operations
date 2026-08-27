// @ts-nocheck
import { Fragment } from "react";

// Curated list of "important expressions" worth highlighting in a learning transcript.
// Covers common connectors, discourse markers, and frequent English idioms / phrasal verbs.
const IMPORTANT_PHRASES: string[] = [
  // Discourse / connectors
  "however", "therefore", "moreover", "furthermore", "nevertheless", "nonetheless",
  "in fact", "in addition", "for example", "for instance", "such as",
  "in order to", "as a result", "on the other hand", "on the contrary",
  "in conclusion", "to sum up", "in summary", "in other words", "that is to say",
  "first of all", "above all", "of course", "by the way", "after all",
  "as well as", "as long as", "as soon as", "even though", "even if",
  "instead of", "rather than", "due to", "because of", "thanks to",
  "according to", "in spite of", "despite", "regarding", "concerning",
  // Phrasal verbs / idioms
  "look forward to", "give up", "find out", "figure out", "come up with",
  "look up", "look into", "take care of", "take part in", "take advantage of",
  "make sure", "make sense", "make up", "keep on", "keep up", "go through",
  "get along", "get rid of", "run out of", "put up with", "pay attention",
  "by the way", "at the end of the day", "in the long run", "for the time being",
  // Emphatic
  "very important", "really important", "the most important", "remember that",
  "keep in mind", "don't forget", "make sure to",
];

// Sort longest first so multi-word matches win over their substrings.
const SORTED = [...IMPORTANT_PHRASES].sort((a, b) => b.length - a.length);
const PATTERN = new RegExp(
  "\\b(" + SORTED.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
  "gi",
);

export function renderHighlighted(text: string): React.ReactNode {
  if (!text) return text;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  PATTERN.lastIndex = 0;
  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(
      <mark
        key={`${m.index}-${m[0]}`}
        className="rounded bg-primary/15 px-0.5 text-foreground underline decoration-primary/40 decoration-1 underline-offset-4"
      >
        {m[0]}
      </mark>,
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}

export function isImportant(word: string): boolean {
  const w = word.toLowerCase().replace(/[^a-z']/g, "");
  return IMPORTANT_PHRASES.some((p) => p === w);
}
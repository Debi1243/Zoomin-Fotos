import type { CSSProperties, ReactNode } from "react";

type Word = string | { text: string; em?: boolean };

/** Renders words in masks so each one can rise into place, one after another. */
export default function SplitWords({ words, start = 0 }: { words: Word[]; start?: number }): ReactNode {
  return words.map((w, i) => {
    const { text, em } = typeof w === "string" ? { text: w, em: false } : w;
    const inner = (
      <span className="word" style={{ "--i": start + i } as CSSProperties}>
        {text}
      </span>
    );
    return (
      <span key={i}>
        <span className="word-mask">{em ? <em>{inner}</em> : inner}</span>
        {i < words.length - 1 && " "}
      </span>
    );
  });
}

"use client";

const PLACEHOLDERS = [
  { label: "Loja", value: "{loja}" },
  { label: "Itens", value: "{itens}" },
  { label: "Total", value: "{total}" },
];

const EMOJIS = ["😊", "🙏", "📦", "🎁", "✅", "❤️"];

export function InsertChips({ onInsert }: { onInsert: (value: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PLACEHOLDERS.map((placeholder) => (
        <button
          key={placeholder.value}
          type="button"
          onClick={() => onInsert(placeholder.value)}
          className="rounded-full bg-clay/10 px-2.5 py-1 text-[11px] font-medium text-clay transition-colors hover:bg-clay/20"
        >
          {placeholder.label}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-clay/15" aria-hidden="true" />
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onInsert(emoji)}
          aria-label={`Inserir ${emoji}`}
          className="rounded-full px-1.5 py-1 text-sm leading-none transition-colors hover:bg-cream"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

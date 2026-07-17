"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";

interface RichTextEditorProps {
  name: string;
  label: string;
  defaultValue?: string;
}

const FONT_SIZES = [
  { label: "Pequeno", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Médio", value: "4" },
  { label: "Grande", value: "5" },
  { label: "Extra grande", value: "6" },
];

export function RichTextEditor({ name, label, defaultValue = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultValue);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = defaultValue || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncValue();
  }

  function syncValue() {
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-navy">{label}</label>

      <div className="overflow-hidden rounded-lg border border-clay/30 focus-within:border-clay focus-within:ring-1 focus-within:ring-clay">
        <div className="flex flex-wrap items-center gap-1 border-b border-clay/20 bg-cream/40 px-2 py-1.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("bold")}
            aria-label="Negrito"
            className="flex h-7 w-7 items-center justify-center rounded text-navy hover:bg-clay/10"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("italic")}
            aria-label="Itálico"
            className="flex h-7 w-7 items-center justify-center rounded text-navy hover:bg-clay/10"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec("underline")}
            aria-label="Sublinhado"
            className="flex h-7 w-7 items-center justify-center rounded text-navy hover:bg-clay/10"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>

          <span className="mx-1 h-5 w-px bg-clay/20" aria-hidden="true" />

          <select
            defaultValue="3"
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(event) => exec("fontSize", event.target.value)}
            aria-label="Tamanho da fonte"
            className="rounded border border-clay/20 bg-white px-2 py-1 text-xs text-navy focus:outline-none"
          >
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div
          ref={editorRef}
          contentEditable
          onInput={syncValue}
          onBlur={syncValue}
          className="min-h-[140px] px-3 py-2 text-sm leading-relaxed text-navy focus:outline-none [&_font]:leading-relaxed"
          suppressContentEditableWarning
        />
      </div>

      <input type="hidden" name={name} value={html} readOnly />
      <p className="mt-1 text-xs text-muted">
        Selecione o texto para aplicar negrito, itálico ou mudar o tamanho da
        fonte.
      </p>
    </div>
  );
}

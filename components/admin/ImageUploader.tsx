"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  bucket: "products" | "categories" | "banners" | "site";
  name: string;
  label: string;
  defaultUrl?: string | null;
  aspectClassName?: string;
}

export function ImageUploader({
  bucket,
  name,
  label,
  defaultUrl = null,
  aspectClassName = "aspect-square",
}: ImageUploaderProps) {
  const [url, setUrl] = useState<string | null>(defaultUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop();
      const path = `${uuidv4()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar a imagem."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-navy">{label}</label>

      <input type="hidden" name={name} value={url ?? ""} readOnly />

      <div
        className={cn(
          "relative w-full max-w-xs overflow-hidden rounded-xl border border-dashed border-clay/40 bg-cream/40",
          aspectClassName
        )}
      >
        {url ? (
          <>
            <Image src={url} alt={label} fill className="object-cover" />
            <button
              type="button"
              onClick={() => setUrl(null)}
              aria-label="Remover imagem"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-navy"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted transition-colors hover:text-clay"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            )}
            <span className="text-xs">
              {isUploading ? "Enviando..." : "Clique para enviar do dispositivo"}
            </span>
          </button>
        )}
      </div>

      {url ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs font-medium text-clay hover:text-clay-dark"
        >
          Trocar imagem
        </button>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label={label}
      />

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

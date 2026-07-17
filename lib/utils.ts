import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = onlyDigits(phone);
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

export function renderMessageTemplate(
  template: string,
  values: { itens: string; total: string; loja: string }
): string {
  return template
    .replaceAll("{itens}", values.itens)
    .replaceAll("{total}", values.total)
    .replaceAll("{loja}", values.loja);
}

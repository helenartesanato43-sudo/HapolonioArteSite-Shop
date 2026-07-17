export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_unique: boolean;
  stock_quantity: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category | null;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp_contact_1: string;
  whatsapp_contact_2: string;
  whatsapp_checkout: string;
  instagram_url: string;
  banner_interval_seconds: number;
  price_color: string;
  heading_color: string;
  accent_color: string;
  text_color: string;
  empty_state_bg_color: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  name: string;
  desktop_image_url: string;
  mobile_image_url: string;
  caption_html: string | null;
  overlay_opacity: number;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  isUnique: boolean;
  stockQuantity: number;
  quantity: number;
}

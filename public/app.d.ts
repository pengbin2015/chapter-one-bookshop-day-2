// Minimal types for the storefront's pure render helpers, so the TypeScript
// tests can import them. The runtime module is plain JS (public/app.js).
export interface BookLike {
  id: string;
  title: string;
  author: string;
  price: number;
  genre: string;
  stock: number;
  description: string;
  cover: string;
}
export interface LineItemLike {
  bookId: string;
  quantity: number;
  unitPrice: number;
}
export interface OrderLike {
  id: string;
  items: LineItemLike[];
  total: number;
}
export function escapeHtml(value: unknown): string;
export function formatPrice(price: number): string;
export function bookCardHTML(book: BookLike): string;
export function bookDetailHTML(book: BookLike): string;
export function cartItemHTML(item: LineItemLike, title: string): string;
export function orderConfirmationHTML(order: OrderLike): string;

import { randomUUID } from "node:crypto";
import type { Book, Cart, LineItem, Order } from "./types.js";
import { SEED_BOOKS } from "./data/seed.js";

/**
 * A tiny in-memory data store. There is no database (see docs/adr/0001).
 * State lives only for the life of the process — restarting the server resets
 * everything back to the seed. That is a deliberate teaching choice, not a bug.
 */
class Store {
  private books: Book[] = [];
  private carts: Map<string, Cart> = new Map();

  constructor() {
    this.reset();
  }

  /** Restore the catalogue to its seeded state. Used by tests and on startup. */
  reset(): void {
    // Deep copy so callers can never mutate the seed by reference.
    this.books = SEED_BOOKS.map((b) => ({ ...b }));
    this.carts = new Map();
  }

  listBooks(): Book[] {
    return this.books.map((b) => ({ ...b }));
  }

  getBook(id: string): Book | undefined {
    const found = this.books.find((b) => b.id === id);
    return found ? { ...found } : undefined;
  }

  createCart(): Cart {
    const cart: Cart = { id: randomUUID(), items: [] };
    this.carts.set(cart.id, cart);
    return this.#cloneCart(cart);
  }

  getCart(cartId: string): Cart | undefined {
    const cart = this.carts.get(cartId);
    return cart ? this.#cloneCart(cart) : undefined;
  }

  setItem(cartId: string, bookId: string, quantity: number): Cart {
    const cart = this.carts.get(cartId);
    if (!cart) throw new CartNotFoundError();
    const book = this.books.find((b) => b.id === bookId);
    if (!book) throw new BookNotFoundError();

    const existing = cart.items.find((i) => i.bookId === bookId);
    if (existing) {
      existing.quantity = quantity;
    } else {
      cart.items.push({ bookId, quantity, unitPrice: book.price });
    }
    return this.#cloneCart(cart);
  }

  removeItem(cartId: string, bookId: string): Cart {
    const cart = this.carts.get(cartId);
    if (!cart) throw new CartNotFoundError();
    cart.items = cart.items.filter((i) => i.bookId !== bookId);
    return this.#cloneCart(cart);
  }

  checkout(cartId: string): Order {
    const cart = this.carts.get(cartId);
    if (!cart) throw new CartNotFoundError();
    if (cart.items.length === 0) throw new EmptyCartError();

    for (const item of cart.items) {
      const book = this.books.find((b) => b.id === item.bookId);
      if (!book || book.stock < item.quantity) {
        const title = book?.title ?? item.bookId;
        throw new InsufficientStockError(title);
      }
    }

    // Deduct stock and build order.
    const orderItems: LineItem[] = [];
    let total = 0;
    for (const item of cart.items) {
      const book = this.books.find((b) => b.id === item.bookId)!;
      book.stock -= item.quantity;
      const lineTotal = item.unitPrice * item.quantity;
      total += lineTotal;
      orderItems.push({ ...item });
    }

    this.carts.delete(cartId);
    return { id: randomUUID(), items: orderItems, total: Math.round(total * 100) / 100 };
  }

  #cloneCart(cart: Cart): Cart {
    return { id: cart.id, items: cart.items.map((i) => ({ ...i })) };
  }
}

export class CartNotFoundError extends Error {}
export class BookNotFoundError extends Error {}
export class EmptyCartError extends Error {}
export class InsufficientStockError extends Error {
  constructor(public readonly title: string) {
    super(`Insufficient stock for: ${title}`);
  }
}

export const store = new Store();

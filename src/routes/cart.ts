import { Router } from "express";
import {
  store,
  CartNotFoundError,
  BookNotFoundError,
  EmptyCartError,
  InsufficientStockError,
} from "../store.js";

export const cartRouter = Router();

cartRouter.post("/api/carts", (_req, res) => {
  res.status(201).json(store.createCart());
});

cartRouter.get("/api/carts/:cartId", (req, res) => {
  const cart = store.getCart(req.params.cartId);
  if (!cart) {
    res.status(404).json({ error: "Cart not found" });
    return;
  }
  res.json(cart);
});

cartRouter.put("/api/carts/:cartId/items/:bookId", (req, res) => {
  const quantity = req.body?.quantity;
  if (!Number.isInteger(quantity) || quantity < 1) {
    res.status(400).json({ error: "quantity must be a positive integer" });
    return;
  }
  try {
    res.json(store.setItem(req.params.cartId, req.params.bookId, quantity));
  } catch (err) {
    if (err instanceof CartNotFoundError) {
      res.status(404).json({ error: "Cart not found" });
    } else if (err instanceof BookNotFoundError) {
      res.status(404).json({ error: "Book not found" });
    } else {
      throw err;
    }
  }
});

cartRouter.delete("/api/carts/:cartId/items/:bookId", (req, res) => {
  try {
    res.json(store.removeItem(req.params.cartId, req.params.bookId));
  } catch (err) {
    if (err instanceof CartNotFoundError) {
      res.status(404).json({ error: "Cart not found" });
    } else {
      throw err;
    }
  }
});

cartRouter.post("/api/carts/:cartId/checkout", (req, res) => {
  try {
    res.json(store.checkout(req.params.cartId));
  } catch (err) {
    if (err instanceof CartNotFoundError) {
      res.status(404).json({ error: "Cart not found" });
    } else if (err instanceof EmptyCartError) {
      res.status(400).json({ error: "Cart is empty" });
    } else if (err instanceof InsufficientStockError) {
      res.status(409).json({ error: err.message });
    } else {
      throw err;
    }
  }
});

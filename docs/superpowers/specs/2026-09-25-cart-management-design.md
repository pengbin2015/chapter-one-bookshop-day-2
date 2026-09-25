# F1 Design — Cart management

Status: Approved
Approved by: Requester (name not provided)
Approval date: 2026-09-25
Traces to: F1 in `docs/intent.md`
Intent version: Approved 2026-09-25

## Purpose

Allow a shopper to collect available Books into a Cart, inspect the Cart total,
and correct quantities before checkout. This replaces error-prone email-based
selection without introducing accounts, checkout, payment, or stock reservation.

## Scope

### Included

- An in-memory Cart identified by an opaque `cartId`.
- Adding Books, viewing Cart contents, setting line-item quantities, and removing
  line items.
- Line and Cart totals calculated from current Book prices.
- Validation that requested quantities are positive integers no greater than the
  Book's current Stock.
- A storefront Cart summary and add-to-cart controls.
- HTTP and pure-render behaviour tests.

### Excluded

- Checkout, Orders, payment, contact details, and collection instructions.
- Customer accounts, authentication, cookies, and server-side sessions.
- Stock reservation or Stock reduction when a Cart changes.
- Persistent carts after a server restart.

## Architecture

### Domain and Store

`src/types.ts` gains Cart domain types. A Cart contains a stable `id` and Line
items. Each Line item has a Book `bookId` and a `quantity`. The Store keeps
Carts in process memory alongside the existing Book catalogue and exposes
methods to create, retrieve, add to, set a quantity on, and remove a line item
from a Cart.

The Store is the runtime source of truth. Public Store methods return copies so
callers cannot mutate Store state. `store.reset()` resets both the seeded
catalogue and all Carts, preserving test isolation and the intentional
restart-reset behaviour.

Cart read models returned by the Store include the associated Book, line total,
and Cart total. Prices are calculated from the Book's current price when the
Cart is read or changed; F1 does not attempt price locking.

### HTTP API

Routes live in `src/routes/carts.ts` and are mounted by `createApp()`.

| Method | Path                               | Request body                                         | Success                               | Failure                                                                                           |
| ------ | ---------------------------------- | ---------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| POST   | `/api/carts`                       | none                                                 | `201` with an empty Cart and `cartId` | n/a                                                                                               |
| GET    | `/api/carts/:cartId`               | none                                                 | `200` with the Cart read model        | `404` for an unknown Cart                                                                         |
| POST   | `/api/carts/:cartId/items`         | `{ "bookId": string, "quantity": positive integer }` | `200` with the updated Cart           | `400` invalid body or quantity; `404` unknown Cart or Book; `400` requested total exceeds Stock   |
| PATCH  | `/api/carts/:cartId/items/:bookId` | `{ "quantity": positive integer }`                   | `200` with the updated Cart           | `400` invalid body or quantity, or quantity exceeds Stock; `404` unknown Cart, Book, or line item |
| DELETE | `/api/carts/:cartId/items/:bookId` | none                                                 | `204`                                 | `404` unknown Cart or line item                                                                   |

All failures use the existing JSON error shape: `{ "error": "message" }`.

Adding a Book already present in a Cart increments its one existing Line item.
The resulting quantity must not exceed current Stock. Updating a quantity
replaces the line quantity; zero is not a removal shorthand, so removal uses
the DELETE route.

### Storefront

The first add action creates a Cart through `POST /api/carts`; the returned ID
is retained in `sessionStorage`. Later actions retrieve that Cart ID and call
the appropriate API route. A missing or expired Cart ID is treated as an empty
Cart. If a stored Cart is no longer available after a server restart, the UI
clears the stored ID and reports that the Cart has been reset.

Catalogue cards and the Book detail view add an Add to Cart control for Books
with Stock above zero. A Cart summary displays each line's Book title, unit
price, quantity controls, line total, remove control, and Cart total. All
values placed into generated HTML use `escapeHtml`; display prices use the
existing `formatPrice` helper. API failures are visibly reported and do not
optimistically change the displayed Cart.

## User Flow

1. A shopper selects Add to Cart for an available Book.
2. The browser creates a Cart if needed, saves its `cartId` in session storage,
   and adds the requested quantity.
3. The shopper sees the updated Cart, including the merged line quantity and
   total.
4. The shopper changes a quantity or removes a line; the browser refreshes the
   Cart from the response.
5. Invalid quantities, unavailable Books, and unknown Carts display an API
   error without changing the displayed Cart.

## Done When

1. A shopper can add an available Book to a Cart, and the first successful add
   creates an opaque `cartId` that the browser retains for the session.
2. A shopper can view all Cart Line items with Book information, unit prices,
   quantities, line totals, and the Cart total.
3. Adding the same Book updates its existing Line item's quantity instead of
   producing a duplicate line.
4. A shopper can replace a Line item's quantity with a positive integer up to
   current Stock, or remove the Line item.
5. Invalid request bodies and non-positive or non-integer quantities return
   `400` JSON errors; unknown Carts, Books, or Line items return `404` JSON
   errors.
6. Additions and quantity updates that would exceed current Stock return a
   `400` JSON error and leave the Cart unchanged.
7. Cart operations never reserve or reduce Stock.
8. Cart state is reset by `store.reset()` and by a server restart.
9. Storefront-generated Cart HTML escapes Book values and uses the shared price
   formatter.
10. API tests verify the Cart lifecycle and validation through `createApp()`;
    render tests verify pure HTML helpers without a browser DOM.

## Validation

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check`

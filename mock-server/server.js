const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// In-memory "database" of created orders. Key = orderId.
const orders = new Map();
let counter = 1000;

// Serve the storefront confirmation page (added in the next step).
app.use(express.static(path.join(__dirname, "public")));

// POST /orders — place an order -> returns an order ID and saves the order.
app.post("/orders", (req, res) => {
  const { item = "Product A", qty = 1 } = req.body || {};
  const simulate = req.query.simulate;

  const shownId = "ORD-" + ++counter; // the ID shown to the storefront UI

  if (simulate === "missing") {
    // Bug: UI shows an order ID, but the backend never saves it.
    return res.status(201).json({ orderId: shownId, item, qty, status: "created" });
  }

  if (simulate === "mismatch") {
    // Bug: backend saves a DIFFERENT id than the UI was given.
    const backendId = "ORD-" + ++counter;
    orders.set(backendId, { orderId: backendId, item, qty, status: "created" });
    return res.status(201).json({ orderId: shownId, item, qty, status: "created" });
  }

  // Happy path: save and return the same, unique id.
  orders.set(shownId, { orderId: shownId, item, qty, status: "created" });
  return res.status(201).json({ orderId: shownId, item, qty, status: "created" });
});

// GET /orders/:id — look up an order. 404 if it doesn't exist.
app.get("/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found", orderId: req.params.id });
  }
  return res.status(200).json(order);
});

let cart = [];
const LARGE_QTY_THRESHOLD = 10;

function backendCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

app.post("/cart/add", (req, res) => {
  const { productId = "PROD-A", qty = 1 } = req.body || {};
  cart.push({ productId, qty });

  if (qty > LARGE_QTY_THRESHOLD) {
    return res.status(500).json({ error: "Failed to add to cart" });
  }
  return res.status(200).json({ status: "added", cartCount: backendCount() });
});

app.get("/cart", (req, res) => {
  return res.status(200).json({ cartCount: backendCount(), items: cart });
});

app.post("/cart/reset", (req, res) => {
  cart = [];
  return res.status(200).json({ cartCount: 0, items: [] });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Mock order service listening on http://localhost:${PORT}`);
});

module.exports = app;
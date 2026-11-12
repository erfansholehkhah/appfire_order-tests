// Mock cart service — a stand-in for the storefront + backend cart, used only so
// the Playwright suite can reproduce the incident deterministically. It does not
// reproduce any proprietary code.
//
// Incident: adding a large quantity returned an error and the cart-icon count did
// not update, yet the items WERE committed to the backend cart.
//
// Two behaviours let the suite both REPRODUCE the bug and PROTECT the fix:
//   default mode  -> buggy: large qty commits items but returns 500 (badge stays stale)
//   ?mode=fixed   -> corrected: any qty commits items AND returns success with the count

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Backend cart. Each entry: { productId, qty }.
let cart = [];
const LARGE_QTY_THRESHOLD = 10; // representative mock value; the real incident involved much larger quantities

function backendCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

app.post("/cart/add", (req, res) => {
  const { productId = "PROD-A", qty = 1 } = req.body || {};
  const mode = req.query.mode; // "fixed" = corrected behaviour
  const large = qty > LARGE_QTY_THRESHOLD;

  // The backend always commits the items (this is why the cart page shows them).
  cart.push({ productId, qty });

  if (large && mode !== "fixed") {
    // BUG: items committed, but the response fails, so the UI never updates the badge.
    return res.status(500).json({ error: "Failed to add to cart" });
  }

  // Happy path or corrected mode: success with the authoritative count.
  return res.status(200).json({ status: "added", cartCount: backendCount(), items: cart });
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
  console.log(`Mock cart service listening on http://localhost:${PORT}`);
});

module.exports = app;
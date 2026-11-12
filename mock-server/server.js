// Mock cart service — a stand-in for the storefront + backend cart, used only so
// the Playwright suite can reproduce the incident deterministically. It does not
// reproduce any proprietary code.
//
// Incident: adding a large quantity committed the items but the response failed,
// and the cart-icon badge (driven only by that response) went stale.
//
// Backend behaviour is constant: a large-quantity add commits the items AND
// returns HTTP 500. The *fix* is a frontend concern — the corrected storefront
// reconciles the badge from authoritative cart state (GET /cart) instead of
// trusting the add-call response (see shop.html, ?mode=fixed).

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let cart = [];
const LARGE_QTY_THRESHOLD = 10; // representative mock value; the real incident involved much larger quantities

function backendCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

app.post("/cart/add", (req, res) => {
  const { productId = "PROD-A", qty = 1 } = req.body || {};
  const large = qty > LARGE_QTY_THRESHOLD;

  // The backend always commits the items (this is why the cart page shows them).
  cart.push({ productId, qty });

  if (large) {
    // BUG: items committed, but the response fails. A correct UI must not rely on
    // this response alone to update the badge.
    return res.status(500).json({ error: "Failed to add to cart" });
  }

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
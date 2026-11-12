import { test as base } from "@playwright/test";
import { CartPage } from "./Pages/CartPage";

type Pages = {
  cartPage: CartPage;
};

export const test = base.extend<Pages>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from "@playwright/test";
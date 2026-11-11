import { request } from "express";
import { expect, test } from "../fixture";


test.describe("Order integration - UI and backend reconciliation", () => {
    test("Order ID shown in the UI exists in the backend @integration", async ({
        confirmationPage,
        request,
    }) => {
        await confirmationPage.goto();
        await confirmationPage.PlaceOrder();
        await expect(confirmationPage.status).toHaveText("Order placed");

        const orderId = await confirmationPage.getOrderId();
        expect(orderId).toMatch(/^ORD-\d+$/);

        const res = await request.get(`/orders/${orderId}`);
        expect(res.status()).toBe(200);
        const order = await res.json();
        expect(order.orderId).toBe(orderId);
    });

    test("Repro: UI shows the Order id that never been created in backend", async ({
        confirmationPage,
        request, }) => {
        await confirmationPage.goto("missing");
        await confirmationPage.PlaceOrder();
        await expect(confirmationPage.status).toHaveText("Order placed");

        const orderId = await confirmationPage.getOrderId()
        const response = await request.get(`/orders/${orderId}`)
        expect(response.status()).toBe(404);
    });
});
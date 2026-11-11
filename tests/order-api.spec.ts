import { test, expect } from "@playwright/test";
import { request } from "express";


test.describe("Order API - Order ID creation ", () => {
    test(" Valid Order Id Returns Test ", async ({ request }) => {
        const response = await request.post("/orders", {
            data: { item: "Product A", qty: 1 },
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.orderId).toBeTruthy();
        expect(body.orderId).toMatch(/^ORD-\d+$/);
        expect(body.status).toBe("created");

    })

    test("Uniqe Order Id Test", async ({ request }) => {
        const ids = new Set<string>();

        for (let i = 0; i < 5; i++) //
        {
            const response = await request.post("/orders", {
                data: { item: "product A ", qty: 1 }
            });
            const body = await response.json();
            ids.add(body.orderId);

            //put each returned order ID into the Set.

        }
        expect(ids.size).toBe(5);



    })


})

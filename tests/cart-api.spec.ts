import { expect, test } from "@playwright/test";
import { request } from "express";

test.describe("Cart API" , () => 
    {
        test.beforeEach(async({request})=> 
            {
                await request.post("/cart/reset");
            })

            test ("adding allowed quantity returns success message and the count number @api",async({request}) =>
                {
                    const response  = await request.post("/cart/add",
                        {
                            data: {productId: "PROD-A",qty:2},
                        });
                        expect(response.status()).toBe(200);
                        const body  = await response.json();
                        expect(body.status).toBe("added");
                        expect(body.cartCount).toBe(2);
                });

                test ("Get / car reflects the items that were added @api",async({request})=> 
                    {
                         await request.post("/cart/add", { data: { productId: "PROD-A", qty: 3 } });
                         const response = await request.get("/cart");
                         expect(response.status()).toBe(200);

                         const body = await response.json();
                         expect(body.cartCount).toBe(3)
                    })
});

    

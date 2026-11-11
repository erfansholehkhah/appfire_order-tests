
import {test, expect} from "../fixture";


test.describe("Cart Integrarion - icon vs backend reconcilation", () => {

    test.beforeEach(async({request}) =>
        {
            await request.post("/cart/reset");
        });

        test("Cart Icon matches the backend cart count (standart qty) @integration",
            async({cartPage, request})=>
                {
                    await cartPage.gotoCartPage();
                    await cartPage.addToCart(3);
                    await expect(cartPage.status).toHaveText("Added to cart");

                    const iconCount= await cartPage.getCartCount();

                    const response = await request.get("/cart");

                    const backendCount  = (await response.json()).cartCount;


                    expect(iconCount).toBe(backendCount)
                })

                test ("Reporduing Larg quantity added shows error and a stale icon, but items are in the backend",
                    async ({cartPage , request})=> {
                        await cartPage.gotoCartPage();
                        await cartPage.addToCart(50)

                        await expect(cartPage.status).toHaveText("Error: could not add to cart");
                        await expect(cartPage.cartIcon).toHaveText("0");


                        const response = await request.get("/cart");
                        const backendCount = (await response.json()).cartCount;
                        expect(backendCount).toBe(50);

                        const iconCount = await cartPage.getCartCount();
                        expect(iconCount).not.toBe(backendCount);

                    }
                )
})
import { test, expect } from "../fixture";

const BULK = 250;
async function backendCount(request: import("@playwright/test").APIRequestContext) {

    const response = await request.get("/cart");
    expect(response.status()).toBe(200)
    return (await response.json()).cartCount as number;

}

test.describe(" Cart integration - icon vs backend reconcilation", () => {
    test.beforeEach(async ({ request }) => {
        await request.post("/cart/reset")
    });



test("Cart Icon matches the backend Cart count (standar qunatity)@integration", async ({ cartPage, request }) => {
    await cartPage.gotoCartPage("fixed");
    await cartPage.addToCart(3);
    await expect(cartPage.status).toHaveText("Added to cart");

    expect(await cartPage.getCartCount()).toBe(await (backendCount(request)));

});

test("Regression: Bulk add reconciles icon with backend in the corrected flow @integration @regression",
    async ({ cartPage,page, request }) => {

        await cartPage.gotoCartPage("fixed");
        const addResponse = page.waitForResponse
        ((r) => r.url().includes("/cart/add") && r.request().method() === "POST");
        await cartPage.addToCart(BULK);
        expect((await addResponse).status()).toBe(500);
        await expect(cartPage.status).toHaveText("Added to cart");
        const backend = await backendCount(request);
        expect(backend).toBe(BULK);
        expect(await cartPage.getCartCount()).toBe(backend);

    })


test("Regression: Bulk add preserves just populated cart @integration @regression", async ({ cartPage, request }) => {
    await cartPage.gotoCartPage("fixed");
    await cartPage.addToCart(3);
    await expect(cartPage.cartIcon).toHaveText("3");

    await cartPage.addToCart(BULK);
    await expect(cartPage.status).toHaveText("Added to cart");

    const backend = await backendCount(request);
    expect(backend).toBe(3 + BULK);
    expect( await cartPage.getCartCount()).toBe(backend);
})


// bug reproducing 

test("Reproducing : bulk add shows error and stale icon , but items are in the backend @integration @bug ",
     async ({ cartPage, request }) => 
    {
    await cartPage.gotoCartPage()
    await cartPage.addToCart(BULK);
    await expect(cartPage.status).toHaveText("Error: could not add to cart");
    await expect(cartPage.cartIcon).toHaveText("0");

    const backend = await backendCount(request);

    expect(backend).toBe(BULK);
    expect(await cartPage.getCartCount()).not.toBe(backend);
})


test("Reproducing : Retrying after the apparent failure duplicates the quantity @integration @bug",
    async({cartPage, request}) => {
        await cartPage.gotoCartPage();

        await cartPage.addToCart(BULK);
        await expect(cartPage.status).toHaveText("Error: could not add to cart");
        await cartPage.addToCart(BULK);
        await expect(cartPage.status).toHaveText("Error: could not add to cart");
        expect(await backendCount(request)).toBe(BULK * 2);
        await expect(cartPage.cartIcon).toHaveText("0");
 });

});  
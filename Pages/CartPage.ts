import { Locator, Page } from "@playwright/test";
export class CartPage {
    readonly page: Page;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly viewCartButton: Locator;
    readonly cartIcon: Locator;
    readonly status: Locator;

    constructor (page: Page)
     
    {
        this.page = page;
        this.quantityInput = page.locator("#qty");
        this.addToCartButton = page.getByRole("button", {name: "Add to cart"});
        this.viewCartButton = page.getByRole("button", {name : "View cart"});
        this.cartIcon =  page.locator("#cart-count");
        this.status = page.locator("#status");

    }


    async gotoCartPage() 
    {
        await this.page.goto("/shop.html");
    }
    
    async addToCart (qty : number) 
    {
        await this.quantityInput.fill(String(qty))
        await this.addToCartButton.click();
    }

    async getCartCount() : Promise<number> 
    {
        return Number (await this.cartIcon.textContent());
    }

}
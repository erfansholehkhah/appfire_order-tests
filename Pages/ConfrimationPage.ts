import{Page, Locator} from "@playwright/test";
export class ConfirmationPage 
{
    readonly page : Page;
    readonly placeOrderButton : Locator;
    readonly status : Locator;
    readonly orderId : Locator;

    constructor(page : Page)
     {
        this.page = page,
        this.placeOrderButton= page.getByRole("button", {name : "Place Order "});
        this.status =  page.locator("#status");
        this.orderId = page.locator("#order-id");
     }

     async goto(simulate?: string) 
     {
        const url = simulate
        ?`/confirmation.html?simulate=${simulate}`
        :"/confirmation.html"
        await this.page.goto(url);
        
     }

     async PlaceOrder () 
     {
        await this.placeOrderButton.click();
     }

     async getOrderId() : Promise<string> 
     {

        const text  = (await this.orderId.textContent()) ?? "";
        return text.replace("Order ID: ", "").trim();
     }
}
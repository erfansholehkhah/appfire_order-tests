import {test, expect } from "../fixture";
import { ConfirmationPage } from "../Pages/ConfrimationPage";



test.describe("Order UI - Confirmation Page ", () => 
    {
        test("placing an order shoows the order Id", async ({confirmationPage})=> 
            {
               
                await confirmationPage.goto();
                await confirmationPage.PlaceOrder();

                await expect(confirmationPage.status).toHaveText(" Order placed");
                await expect(confirmationPage.orderId).toContainText("Order ID: ORD-");
                const id = await confirmationPage.getOrderId();
                expect(id).toMatch(/^ORD-\d+$/);

                
            })
    });
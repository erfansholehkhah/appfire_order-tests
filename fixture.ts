import {test as base } from "@playwright/test";
import { ConfirmationPage  } from "./Pages/ConfrimationPage";
import { CartPage } from "./Pages/CartPage";

type Pages = 
{
    confirmationPage :ConfirmationPage;
    cartPage : CartPage

};

export const test = base.extend<Pages>({

    confirmationPage: async ({page} , use) => 
        {
            const confirmationPage = new ConfirmationPage(page)
            await use(confirmationPage)
        },

        cartPage: async ({page},use) => 
            {
                const cartPage = new CartPage(page)
                await use (cartPage);
            },




});

export {expect } from "@playwright/test"
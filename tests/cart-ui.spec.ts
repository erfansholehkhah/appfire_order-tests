
import{test, expect} from "../fixture"


test.describe("Cart UI Test", () => 
    {
        test.beforeEach(async ({request}) => {
                await request.post("/cart/reset");
            });
        
  


    test("adding allowed quantity up the cart icon @ui ", async ({cartPage}) =>{

            await cartPage.gotoCartPage();
            await expect(cartPage.cartIcon).toHaveText("0");
            await cartPage.addToCart(2);
            await expect(cartPage.status).toHaveText("Added to cart");
            await expect(cartPage.cartIcon).toHaveText("2")
        });

    });
        

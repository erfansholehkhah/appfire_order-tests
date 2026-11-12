import {test, expect} from "../fixture"

 const THRESHOLD = 10 ;

test.describe("Cart API", ()=> {
    test.beforeEach(async ({request})=> {
        await request.post("/cart/reset");


    });

    test("adding the normall qunatity returns success and the count @api ", async({request})=> {
        const response =  await request.post("/cart/add",  {data: {productId: "PROD-A", qty: 2}});
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe("added");
        expect(body.cartCount).toBe(2);

    });

    test ("GET /cart reflects the committed items and their content @api",async({request})=> 
        {
            await request.post("/cart/add",{ data: { productId: "PROD-A", qty: 3}});
            const response = await request.get("/cart");
            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.cartCount).toBe(3);

            expect(body.items).toEqual([{ productId: "PROD-A", qty: 3 }])
        })


        //boundary testst


        test(`quantity ${THRESHOLD  -1} {at the threshold} still succeed @api @boundary`,async({request})=> 
            {
                const response = await request.post("/cart/add", { data: { productId: "PROD-A", qty: THRESHOLD -1 }});
                expect(response.status()).toBe(200);
                expect ((await response.json()).cartCount).toBe(THRESHOLD-1);

            });

            test (`qty ${THRESHOLD} (at the threshold) still succeeds @api @boundary`,async({request})=> 
                {
                    const response = await request.post("/cart/add", { data: { productId: "PROD-A", qty: THRESHOLD } });
                    expect(response.status()).toBe(200);
                    expect((await response.json()).cartCount).toBe(THRESHOLD);
                });

            test(`qty ${THRESHOLD +1 }(just over the threshold) errors but still commit @api @ boundary @ bug`, async ({request})=>
                {
                    const addResponse  = await request.post("/cart/add", { data: { productId: "PROD-A", qty: THRESHOLD + 1 } });
                    expect(addResponse.status()).toBe(500);
                    const cartResponse = await request.get("/cart");
                    expect(cartResponse.status()).toBe(200);
                    expect((await cartResponse.json()).cartCount).toBe(THRESHOLD +1 );
                });    
});
import { test, expect } from '@playwright/test';

test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "emailnishant@example.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Email@example.com1");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   const titles = await page.locator('.card-body b'). allTextContents()
   console.log(titles)
   const count = await products.count()

   for(let i = 0; i < count ; i++){
       const productClicked = await products.nth(i).locator('b').textContent()
       if(productClicked === productName){
         await products.nth(i).locator('text =  Add To Cart').click()
         break
       }
   }

   await page.getByRole('button', { name: '   Cart' }).click()
   await page.getByRole('button', { name: 'Checkout❯' }).waitFor()
   const boolProductFound = await page.locator('h3', { hasText: productName }).isVisible();

   expect(boolProductFound).toBeTruthy()
   await page.getByRole('button', { name: 'Checkout❯' }).click()
   await page.getByRole('textbox', { name: 'Select Country' }).waitFor()

   await page.getByRole('textbox', { name: 'Select Country' }).click()
   await page.getByRole('textbox', { name: 'Select Country' }).pressSequentially('ind')

   const dropDownOptions =await page.locator('.ta-results') 
   await dropDownOptions.waitFor()

   const optionsCount = await dropDownOptions.locator('button span').count()
   for(let i = 0; i< optionsCount; ++i){
      const dropOption = await dropDownOptions.locator('button span').nth(i).textContent()
      if(dropOption?.trim() === 'India'){
       await dropDownOptions.locator('button span').nth(i).click()
       break
      }

   }


   expect(await page.locator(".user__name [type = 'text']").first()).toHaveText(email)

   await page.pause()

   await page.locator('.action__submit').click()

   await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ')


  const rawOrderID = await page.locator('.em-spacer-1 .ng-star-inserted').textContent()
  const orderId = (rawOrderID || '').trim().replace(/\|/g, '')


   console.log(orderId)

   await page.getByRole('button', { name: '   ORDERS' }).click()

   await page.locator('tbody').waitFor()

   const rows = await page.locator('tbody tr')

   

   for(let i =0; i<await rows.count(); i++){

    const orderIdOptions = await rows.nth(i).locator('th').textContent()

    console.log(orderIdOptions)

    if(orderIdOptions?.trim()?.includes(orderId.trim())){
      console.log('OrderID is found in the orders section')
      await rows.nth(i).locator('button').first().click()
      break;
    }

   }

   await page.pause()

  






});

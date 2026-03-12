import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { error } from 'console';
import { DashboardPage } from '../src/test/pages/DashboardPage';

test.describe('SauceDemo Application Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('@SauceDemoLogin Login with valid credentials', async () => {
    // Enter username
    await page.locator('//input[contains(@id,"user-name")]').fill('standard_user');
    
    // Enter password
    await page.locator('//input[contains(@id,"password")]').fill('secret_sauce')

    const screenshotLogin = await page.screenshot({fullPage: true})

    test.info().attach('screenshotLogin', {
      body: screenshotLogin,
      contentType: 'image/png',
    });

    
    
    // Click login button
    await page.locator('//input[contains(@id,"login-button")]').click();
    
    // Verify successful login by checking for products page
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible();

    const screenshotInventory = await page.screenshot({fullPage :  true})
    test.info().attach('screenshotInvemtory', {body : screenshotInventory, contentType : 'image/png'})
  });

  test('@SauceDemoLoginFail Login with invalid credentials', async () => {
    // Enter username
    await page.locator('//input[contains(@id,"user-name")]').fill('invalid_user');
    
    // Enter password
    await page.locator('//input[contains(@id,"password")]').fill('wrong_password')

    const screenshotLogin = await page.screenshot({fullPage: true})

    test.info().attach('screenshotLogin', {
      body: screenshotLogin,
      contentType: 'image/png',
    });

    
    
    // Click login button
    await page.locator('//input[contains(@id,"login-button")]').click(); 
    // Verify error message appears
    const errorMessage = page.locator('[data-test="error"]');
    await errorMessage.waitFor({ state: 'visible' });
    await expect(errorMessage).toContainText('Epic sadface');
    const errorScreenshot = await page.screenshot({fullPage : true})
    test.info().attach('screenshotLoginFail', {body : errorScreenshot, contentType : 'image/png'})
  });

  test('@SauceDemoAddroduct Add product to cart and checkout', async () => {
    // Login first
    const dashboardPage = new DashboardPage(page);  
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Wait for inventory to load
    await page.waitForSelector('.inventory_item');
    await expect(page).toHaveURL(/.*inventory/);

    await page.pause();

   //add product to cart
   await dashboardPage.searchProductAddCartSauce('Sauce Labs Backpack');

   const addTocartScreenshot = await page.screenshot({fullPage : true})
   test.info().attach('screenshotAddToCart', {body : addTocartScreenshot, contentType : 'image/png'})
    // // Verify cart badge updates
    // const cartBadge = page.locator('.shopping_cart_badge');
    // await expect(cartBadge).toContainText('1');

    // // Navigate to cart
    // await page.click('.shopping_cart_link');
    // await expect(page).toHaveURL(/.*cart/);

    // // Verify product in cart
    // const cartItem = page.locator('.inventory_item_name');
    // await expect(cartItem).toContainText('Sauce Labs Backpack');

    // // Proceed to checkout
    // await page.click('[data-test="checkout"]');
    // await expect(page).toHaveURL(/.*checkout-step-one/);

    // // Fill checkout information
    // await page.fill('[data-test="firstName"]', 'John');
    // await page.fill('[data-test="lastName"]', 'Doe');
    // await page.fill('[data-test="postalCode"]', '12345');

    // // Continue to checkout step 2
    // await page.click('[data-test="continue"]');
    // await expect(page).toHaveURL(/.*checkout-step-two/);

    // // Verify order summary
    // await expect(page.locator('.summary_subtotal_label')).toBeVisible();

    // // Complete purchase
    // await page.click('[data-test="finish"]');
    // await expect(page).toHaveURL(/.*checkout-complete/);

    // // Verify order completion message
    // const completeMessage = page.locator('.complete-header');
    // await expect(completeMessage).toContainText('Thank you for your order');
  });

  test('@SauceDemo Product sorting', async () => {
    // Login
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Wait for inventory to load
    await page.waitForSelector('.inventory_item');

    // Sort by price (low to high)
    await page.selectOption('[data-test="product-sort-container"]', 'lohi');

    // Verify products are sorted
    const prices = await page.locator('.inventory_item_price').allTextContents();
    console.log('Prices after sorting (low to high):', prices);

    // Extract numeric values and verify sorting
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test('@SauceDemo Logout', async () => {
    // Login
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Wait for inventory to load
    await page.waitForSelector('.inventory_item');

    // Open menu
    await page.click('#react-burger-menu-btn');

    // Click logout
    await page.click('#logout_sidebar_link');

    // Verify redirected to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});

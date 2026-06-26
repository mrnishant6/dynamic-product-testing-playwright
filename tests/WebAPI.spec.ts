import { test, request } from '@playwright/test';
import { POManager } from '../src/test/ProductTest/pages/POManager';
import testData from '../src/test/data/testData.json';

let token: string;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const responseLogin = await apiContext.post(
    'https://rahulshettyacademy.com/api/ecom/auth/login',
    {
      data: {
        userEmail: testData.userEmail,
        userPassword: testData.userPassword,
      },
    }
  );


  const loginResponsejson = await responseLogin.json();
  token = loginResponsejson.token;
  console.log('Login successful. Token generated.');
});

test('@Webst Client App login', async ({ page }) => {
  const poManager = new POManager(page);

  // 1. Initialize pages
  const loginPage = poManager.getLoginPage();
  const dashboardPage = poManager.getDashboardPage();
  const checkoutPage = poManager.getCheckoutPage();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();

  // 2. Login & Navigate
  await loginPage.setTokenInLocalStorage(token);
  await loginPage.goTo();

  // 3. Search and Add Product to Cart
  await dashboardPage.searchProductAddCart(testData.productName);
  await dashboardPage.navigateToCart();

  // 4. Verify in Cart & Proceed to Checkout
  await checkoutPage.verifyProductIsDisplayed(testData.productName);
  await checkoutPage.proceedToCheckout();

  // 5. Select Country & Place Order
  await checkoutPage.selectCountry(testData.countryCode, testData.countryName);
  await checkoutPage.verifyEmail(testData.userEmail);
  await checkoutPage.submitOrder();

  // 6. Verify Order ID & View History
  await checkoutPage.verifyOrderConfirmation(testData.successMessage);
  const orderId = await checkoutPage.getOrderId();
  console.log(`Order Placed Successfully: ${orderId}`);

  await ordersHistoryPage.navigateToOrders();
  await ordersHistoryPage.verifyOrderPresentAndView(orderId);
});

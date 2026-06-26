import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { KotakHomePage } from '../src/test/pages/KotakTest/HomePage';

test('Kotak bank Demo', async ({ page }) => {
  test.setTimeout(60000); // Set timeout to 60 seconds for this test
  const homePage = new KotakHomePage(page);
  await homePage.navigateToKotakHomePage();
  await homePage.clickCreditCardsLink();
  await homePage.clickCategoriesLink();
  await homePage.clickTravelLabel();
  await homePage.clickShowCardsLink();

  const travelCardCount = await homePage.getTravelCardCount();
  console.log(`Number of travel credit cards: ${travelCardCount}`);

  const secondCardBulletText = await homePage.getCardBulletText(1);
  const expectedText = "Welcome benefit of 2,500 IndiGo BluChips Voucher";
  expect(secondCardBulletText).toContain(expectedText);

  const secondCardBulletCount = await homePage.getCardBulletItemsCount(1);
  console.log(`Number of bullet items on second card: ${secondCardBulletCount}`);

});

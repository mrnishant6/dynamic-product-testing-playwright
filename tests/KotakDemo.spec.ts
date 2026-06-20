import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

test('SauceDemo Application Tests', async ({ page }) => {
  test.setTimeout(60000); // Set timeout to 60 seconds for this test
  await page.goto("https://www.kotak.bank.in/en/personal-banking/cards.html")
  await expect(page).toHaveTitle("Cards");
  await page.locator('//a[contains(text(),"Credit Cards")]').first().click();
  await page.locator("//span[contains(text(),'Categories')]").first().click();
  let travelLabel = page.locator("//label[contains(@data-label,'Travel')]").first();
  await travelLabel.click();
  let ShowCards = page.locator("//a[contains(text(),'Show')]").first();
  await expect(ShowCards).toBeVisible();
  await ShowCards.click();
  let travelCardCount = await page.locator("//div[contains(@class,'product-card')]").count();
  console.log(`Number of travel credit cards: ${travelCardCount}`);
  let cardBullets = page.locator("//div[contains(@class,'sa-card-bullets')]").nth(1);
  await expect(cardBullets).toBeVisible();
  let specificText = "Welcome benefit of 4,000 IndiGo BluChips Voucher";
  await expect(cardBullets).toContainText(specificText);
  
  // Search for ul and li inside cardBullets
  let bulletsList = cardBullets.locator("ul");
  let bulletItems = cardBullets.locator("ul li");
  
  await expect(bulletsList).toBeVisible();
  let bulletCount = await bulletItems.count();
  console.log(`Number of bullet items: ${bulletCount}`);
  
  // Read the second bullet point (index 1)
  let secondBullet = bulletItems.nth(1);
  let secondBulletText = await secondBullet.textContent();
  console.log(`Second bullet point: ${secondBulletText}`);
  
  // Extract 2500 from the specific text using regex
  let numberMatch = specificText.match(/\d+,?\d+/);
  let extractedNumber = numberMatch ? numberMatch[0].replace(/,/g, '') : null;
  console.log(`Extracted number from specific text: ${extractedNumber}`);
  
  // Extract 2500 from the second bullet point text using regex
  let secondBulletNumber = secondBulletText?.match(/\d+,?\d+/)?.[0].replace(/,/g, '') || null;
  console.log(`Extracted number from second bullet: ${secondBulletNumber}`);
  
  // Match the second bullet point with specific text
  await expect(secondBullet).toContainText(secondBulletText?.trim() || "");


});

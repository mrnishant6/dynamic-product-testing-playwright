import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly selectCountryField: Locator;
    readonly dropDownOptions: Locator;
    readonly submitAction: Locator;
    readonly orderConfirmation: Locator;
    readonly userEmailField: Locator;
    readonly orderId: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', { name: 'Checkout❯' });
        this.selectCountryField = page.getByRole('textbox', { name: 'Select Country' });
        this.dropDownOptions = page.locator('.ta-results');
        this.submitAction = page.locator('.action__submit');
        this.orderConfirmation = page.locator('.hero-primary');
        this.userEmailField = page.locator(".user__name [type = 'text']").first();
        this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
    }

    async verifyProductIsDisplayed(productName: string) {
        await this.checkoutButton.waitFor();
        await expect(this.page.locator('h3', { hasText: productName })).toBeVisible();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async selectCountry(countryCode: string, countryName: string) {
        await this.selectCountryField.waitFor();
        await this.selectCountryField.click();
        await this.selectCountryField.pressSequentially(countryCode);

        await this.dropDownOptions.waitFor();
        const optionsCount = await this.dropDownOptions.locator('button span').count();
        for (let i = 0; i < optionsCount; ++i) {
            const dropOption = await this.dropDownOptions.locator('button span').nth(i).textContent();
            if (dropOption?.trim() === countryName) {
                await this.dropDownOptions.locator('button span').nth(i).click();
                break;
            }
        }
    }

    async verifyEmail(email: string) {
        await expect(this.userEmailField).toHaveText(email);
    }

    async submitOrder() {
        await this.submitAction.click();
    }

    async verifyOrderConfirmation(message: string) {
        await expect(this.orderConfirmation).toHaveText(message);
    }

    async getOrderId(): Promise<string> {
        const rawOrderID = await this.orderId.textContent();
        return (rawOrderID || '').trim().replace(/\|/g, '');
    }
}

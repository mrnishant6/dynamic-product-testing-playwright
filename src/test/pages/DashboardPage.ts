import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly products: Locator;
    readonly cartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.cartButton = page.getByRole('button', { name: '   Cart' });
    }

    async searchProductAddCart(productName: string) {
        const count = await this.products.count();
        for (let i = 0; i < count; i++) {
            const productClicked = await this.products.nth(i).locator('b').textContent();
            if (productClicked === productName) {
                await this.products.nth(i).locator('text =  Add To Cart').click();
                break;
            }
        }
    }

    async navigateToCart() {
        await this.cartButton.click();
    }
}

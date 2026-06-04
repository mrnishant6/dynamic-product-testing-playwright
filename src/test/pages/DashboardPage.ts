import { Page} from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async searchProductAddCart(productName: string) {
        const products = this.page.locator(".card-body");
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const productClicked = await products.nth(i).locator('b').textContent();
            if (productClicked === productName) {
                await products.nth(i).locator('text =  Add To Cart').click();
                break;
            }
        }
    }

        async searchProductAddCartSauce(productName: string) {
        const sauceProducts = this.page.locator('.inventory_item');
        const count = await sauceProducts.count();
        for (let i = 0; i < count; i++) {
            const productClicked = await sauceProducts.nth(i).locator('.inventory_item_name').textContent();
            console.log(`Product ${i}: ${productClicked}`);
            if (productClicked === productName) {
                console.log(`Product found: ${productClicked}`);
                await sauceProducts.nth(i).locator('text =  Add To Cart').click();
                break;
            }
        }
    }

    async navigateToCart() {
        const cartBadge = this.page.getByRole('button', { name: '   Cart' });
        await cartBadge.click();
    }
}

import { Page, Locator, expect } from '@playwright/test';

export class OrdersHistoryPage {
    readonly page: Page;
    readonly ordersButton: Locator;
    readonly tableBody: Locator;
    readonly rows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ordersButton = page.getByRole('button', { name: '   ORDERS' });
        this.tableBody = page.locator('tbody');
        this.rows = page.locator('tbody tr');
    }

    async navigateToOrders() {
        await this.ordersButton.click();
    }

    async verifyOrderPresentAndView(orderId: string) {
        await this.tableBody.waitFor();
        const rowCount = await this.rows.count();

        let orderFound = false;
        for (let i = 0; i < rowCount; i++) {
            const orderIdOption = await this.rows.nth(i).locator('th').textContent();
            if (orderIdOption?.trim()?.includes(orderId.trim())) {
                orderFound = true;
                await this.rows.nth(i).locator('button').first().click();
                break;
            }
        }
        expect(orderFound).toBeTruthy();
    }
}

import { Page } from '@playwright/test';
import { LoginPage } from '../../../main/pages/LoginPage';
import { DashboardPage } from './DashboardPage';
import { CheckoutPage } from './CheckoutPage';
import { OrdersHistoryPage } from './OrdersHistoryPage';

export class POManager {
    readonly page: Page;
    readonly loginPage: LoginPage;
    readonly dashboardPage: DashboardPage;
    readonly checkoutPage: CheckoutPage;
    readonly ordersHistoryPage: OrdersHistoryPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCheckoutPage() {
        return this.checkoutPage;
    }

    getOrdersHistoryPage() {
        return this.ordersHistoryPage;
    }
}

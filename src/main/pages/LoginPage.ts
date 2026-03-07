import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto("https://rahulshettyacademy.com/client/");
    }

    async setTokenInLocalStorage(token: string) {
        await this.page.addInitScript(value => {
            window.localStorage.setItem('token', value);
        }, token);
    }

    async login(email: string, password: string) {
        await this.page.locator("#userEmail").fill(email);
        await this.page.locator("#userPassword").fill(password);
        await this.page.locator("[value='Login']").click();
        await this.page.waitForLoadState('networkidle');
    }
}

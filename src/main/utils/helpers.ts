import { Page, TestInfo } from "@playwright/test";

export class helper{
    readonly page: Page;
    readonly testInfo : TestInfo;

    constructor(page: Page, testInfo : TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
    }

    async takeScreenshot(name: string){
        const screenshot = await this.page.screenshot({fullPage: true});
        await this.testInfo.attach(name, {
            body: screenshot,
            contentType: 'image/png',
        });
    }
}
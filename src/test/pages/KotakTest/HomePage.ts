import{Page, Locator, expect} from '@playwright/test';
import testData from '../../data/testData.json';

export class KotakHomePage{
    readonly page : Page;
    readonly creditCardsLink : Locator;
    readonly categoriesLink : Locator;
    readonly travelLabel : Locator;
    readonly showCardsLink : Locator;
    readonly productCards : Locator;
    readonly cardBullets : Locator;

    constructor(page: Page){
        this.page = page;
        this.creditCardsLink = page.locator('//a[contains(text(),"Credit Cards")]');
        this.categoriesLink = page.locator("//span[contains(text(),'Categories')]");
        this.travelLabel = page.locator("//label[contains(@data-label,'Travel')]");
        this.showCardsLink = page.locator("//a[contains(text(),'Show')]");
        this.productCards = page.locator("div.sa-card:visible");
        this.cardBullets = page.locator("div.sa-card-bullets");
    }

    async navigateToKotakHomePage(){
        await this.page.goto(testData.kotak_url);
        await expect(this.page).toHaveTitle("Cards");
    }

    async clickCreditCardsLink(){
        await this.creditCardsLink.first().click();
        await expect(this.categoriesLink.first()).toBeVisible();
    }

    async clickCategoriesLink(){
        await this.categoriesLink.first().click();
        await expect(this.travelLabel.first()).toBeVisible();
    }

    async clickTravelLabel(){
        await this.travelLabel.first().click();
        await expect(this.showCardsLink.first()).toBeVisible();
    }

    async clickShowCardsLink(){
        await Promise.all([
            this.page.waitForSelector('div.sa-card:visible'),
            this.showCardsLink.first().click(),
        ]);
    }

    async getTravelCardCount(): Promise<number>{
        await expect(this.productCards.first()).toBeVisible();
        return await this.productCards.count();
    }

    async getCardBullets(index: number): Promise<Locator>{
        const card = this.productCards.nth(index);
        await card.waitFor({ state: 'visible' });
        return card.locator('div.sa-card-bullets');
    }

    async getCardBulletText(index: number): Promise<string | null>{
        const bullets = await this.getCardBullets(index);
        await bullets.waitFor({ state: 'visible' });
        return await bullets.textContent();
    }

    async getCardBulletItemsCount(index: number): Promise<number>{
        const bullets = await this.getCardBullets(index);
        return await bullets.locator('ul li').count();
    }
}

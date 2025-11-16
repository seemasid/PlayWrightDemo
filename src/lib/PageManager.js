import { test as base } from '@playwright/test';
import { AmazonPage } from '../pages/AmazonPage';
import { FlipkartPage } from '../pages/flipkartPage';
import { BuyBooksIndiaPage } from '../pages/BuyBooksIndiaPage';

export const test = base.extend({
    bookName: '',
    platform: '',
    amazonPage: async ({ page, context, platform, bookName }, use) => {
        const amazonPage = new AmazonPage(page, context, platform, bookName);
        await use(amazonPage);
    },
    flipkartPage: async ({ page, context, platform, bookName }, use) => {
        const flipkartPage = new FlipkartPage(page, context, platform, bookName);
        await use(flipkartPage);
    },
    booksBuyIndiaPage: async ({ page, context, platform, bookName }, use) => {
        const booksBuyIndiaPage = new BuyBooksIndiaPage(page, context, platform, bookName);
        await use(booksBuyIndiaPage);
    }
})

import { test as base } from '@playwright/test';
import { AmazonPage } from '../pages/AmazonPage';
import { FlipkartPage } from '../pages/FlipkartPage';
import { BuyBooksIndiaPage } from '../pages/BuyBooksIndiaPage';
import { PageActions } from './PageActions';

/**
 * @typedef {import('../pages/AmazonPage').AmazonPage} AmazonPageType
 * @typedef {import('../pages/FlipkartPage').FlipkartPage} FlipkartPageType
 * @typedef {import('../pages/BuyBooksIndiaPage').BuyBooksIndiaPage} BuyBooksIndiaPageType
 * @typedef {import('../lib/PageActions').PageActions} PageActionsType
 */

/**
 * Combined fixtures for editor/type info.
 * @typedef {Object} MyFixtures
 * @property {AmazonPageType} amazonPage
 * @property {FlipkartPageType} flipkartPage
 * @property {BuyBooksIndiaPageType} booksBuyIndiaPage
 * @property {PageActionsType} pageActions
 * @property {String} bookName
 * @property {String} platform
 * @property {Number} qty
 */

/** @type {import('@playwright/test').TestType<MyFixtures,MyFixtures>} */

export const test = base.extend({
    platform: '',
    bookName: '',
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
    },
    pageActions: async ({ page, context, platform, bookName }, use) => {
        const pageActions = new PageActions(page, context, platform, bookName);
        await use(pageActions);
    },
})

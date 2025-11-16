// @ts-nocheck
/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('@playwright/test').BrowserContext} Context */

import { PageActions } from "../lib/pageActions";

export class FlipkartPage {
    /**
  * @param {Page} page
  * @param {Context} context
  */
    constructor(page, context, platform, bookName) {
        this.page = page;
        this.context = context;
        this.pageActions = new PageActions(this.page, this.context, platform)
        this.pageUrl = 'https://www.flipkart.com';
        this.searchBar = 'input[type="text"]';
        this.searchBtn = 'button[type="submit"]';
        this.bookName = bookName;
        this.bookPriceLoc = `a[title*="${this.bookName}"]~a>div>div:first-of-type`;
    }

    async navigateToPage() {
        await this.pageActions.navigateToUrl(this.pageUrl)
    }

    async searchBook() {
        await this.pageActions.searchBook({ text: this.bookName, searchBar: this.searchBar, searchBtn: this.searchBtn })
    }

    async navigateToCheapestBook() {
        await this.pageActions.navigateToCheapestBook({ bookPriceLoc: this.bookPriceLoc, bookName: this.bookName })
    }

    async fetchBookData() {
        await this.pageActions.fetchBookData();
    }
}
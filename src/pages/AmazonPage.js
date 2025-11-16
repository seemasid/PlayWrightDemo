// @ts-nocheck
/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('@playwright/test').BrowserContext} Context */

import { PageActions } from "../lib/pageActions";

export class AmazonPage {
    /**
  * @param {Page} page
  * @param {Context} context
  */
    constructor(page, context, platform, bookName) {
        this.page = page;
        this.context = context;
        this.pageActions = new PageActions(this.page, this.context, platform)
        this.pageUrl = 'https://www.amazon.in';
        this.searchBar = 'input#twotabsearchtextbox';
        this.searchBtn = 'input#nav-search-submit-button';
        this.bookName = bookName;
        this.bookPriceLoc = `//span[contains(text(),"${this.bookName}")]/../../../following-sibling::div//div[@data-cy="price-recipe"]//span[@class="a-price"]/span[@class="a-offscreen"]`;
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
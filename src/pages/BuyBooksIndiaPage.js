// @ts-nocheck
/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('@playwright/test').BrowserContext} Context */

import { PageActions } from "../lib/pageActions";

export class BuyBooksIndiaPage {
    /**
  * @param {Page} page
  * @param {Context} context
  */
    constructor(page, context, platform, bookName) {
        this.page = page;
        this.context = context;
        this.pageActions = new PageActions(this.page, this.context, platform);
        this.pageUrl = 'https://www.buybooksindia.com/ ';
        this.searchBar = 'input[type="text"][id="keyword"]';
        this.searchBtn = 'button[type="submit"][id="find-books"]';
        this.bookName = bookName;
        this.bookClickLoc = `//img[starts-with(translate(@title, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${this.bookName.toLowerCase()}')]`;
        this.bookPriceLoc = `${this.bookClickLoc}/../../following-sibling::div[@class="right-block"]//span[@class="price product-price"]`
    }

    async navigateToPage() {
        await this.pageActions.navigateToUrl(this.pageUrl)
    }

    async searchBook() {
        await this.pageActions.searchBook({ text: this.bookName, searchBar: this.searchBar, searchBtn: this.searchBtn })
    }

    async navigateToCheapestBook() {
        await this.pageActions.navigateToCheapestBook({ bookPriceLoc: this.bookPriceLoc, bookClickLoc: this.bookClickLoc, bookName: this.bookName })
    }

    async fetchBookData() {
        await this.pageActions.fetchBookData();
    }
}

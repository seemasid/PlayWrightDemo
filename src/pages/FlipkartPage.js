import { PageActions } from "../lib/PageActions";

export class FlipkartPage {
    /**
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').BrowserContext} context
 * @param {string} platform
 * @param {string} bookName
 */
    constructor(page, context, platform, bookName) {
        this.isBookFound = false;
        this.page = page;
        this.context = context;
        this.pageActions = new PageActions(this.page, this.context, platform)
        this.pageUrl = 'https://www.flipkart.com';
        this.searchBar = 'input[type="text"]';
        this.searchBtn = 'button[type="submit"]';
        this.bookName = bookName;
        this.bookPriceLoc = `a[title*="${this.bookName}"]~a>div>div:first-of-type`;
        this.publisher = '//li[starts-with(text(),"Publisher:")]';
        this.author = '//div[text()="Author"]/following-sibling::div//a[contains(@href,"contributor")]';
        this.isbnLoc = '//li[starts-with(text(),"ISBN:")]'
    }

    async navigateToPage() {
        await this.pageActions.navigateToUrl(this.pageUrl)
    }

    async searchBook() {
        await this.pageActions.searchBook({ text: this.bookName, searchBar: this.searchBar, searchBtn: this.searchBtn })
    }

    async navigateToCheapestBook() {
        const { isBookFound, bookPrice } = await this.pageActions.navigateToCheapestBook({ bookPriceLoc: this.bookPriceLoc, bookName: this.bookName })
        this.isBookFound = isBookFound;
        return { isBookFound, bookPrice };
    }

    async fetchBookData() {
        const bookObj = {
            publisher: '',
            author: '',
            isbn: '',
        }
        if (this.isBookFound) {
            const allPages = this.context.pages();
            this.page = allPages[allPages.length - 1];
            bookObj.publisher = (await this.page.locator(this.publisher).textContent()).replace('Publisher:', '').trim();
            try {
                await this.page.waitForSelector(this.author, { timeout: 5000 })
                bookObj.author = await this.page.locator(this.author).textContent()
            } catch (err) { }
            try {
                await this.page.waitForSelector(this.isbnLoc, { timeout: 5000 })
                bookObj.isbn = await this.page.locator(isbnLoc).textContent()
            } catch (err) { }
        }
        return bookObj;
    }
}
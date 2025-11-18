import { PageActions } from '../lib/PageActions';

export class BuyBooksIndiaPage {
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
        this.pageActions = new PageActions(this.page, this.context, platform);
        this.pageUrl = 'https://www.buybooksindia.com/ ';
        this.searchBar = 'input[type="text"][id="keyword"]';
        this.searchBtn = 'button[type="submit"][id="find-books"]';
        this.bookName = bookName;
        this.bookClickLoc = `//img[starts-with(translate(@title, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${this.bookName.toLowerCase()}')]`;
        this.bookPriceLoc = `${this.bookClickLoc}/../../following-sibling::div[@class="right-block"]//span[@class="price product-price"]`
        this.publisher = '//div[@id="product-detail"]//td[text()="Publisher"]/following-sibling::td//h3';
        this.author = 'div#author>h3';
        this.isbnLoc = ['//td[text()="ISBN-13"]/following-sibling::td/h4', '//td[text()="ISBN-10"]/following-sibling::td/h4', '//td[text()="ISBN"]/following-sibling::td/h4']
    }

    async navigateToPage() {
        await this.pageActions.navigateToUrl(this.pageUrl)
    }

    async searchBook() {
        await this.pageActions.searchBook({ text: this.bookName, searchBar: this.searchBar, searchBtn: this.searchBtn })
    }

    async navigateToCheapestBook() {
        const { isBookFound, bookPrice } = await this.pageActions.navigateToCheapestBook({ bookPriceLoc: this.bookPriceLoc, bookClickLoc: this.bookClickLoc, bookName: this.bookName })
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
            const pageInstance = allPages[allPages.length - 1];
            await pageInstance.locator('//a[text()="Product Specifications"]').click();
            bookObj.publisher = (await this.page.locator(this.publisher).textContent()).replace('Publisher:').trim();
            try {
                await this.page.waitForSelector(this.author, { timeout: 5000 })
                bookObj.author = await this.page.locator(this.author).textContent()
            } catch (err) { }
            let isbnLoc;
            for (let loc of this.isbnLoc) {
                try {
                    await this.page.waitForSelector(loc, { timeout: 5000 })
                    isbnLoc = loc;
                    break;
                } catch { }
            }

            if (isbnLoc) {
                bookObj.isbn = await this.page.locator(isbnLoc).textContent()
            }
        }
        return bookObj;
    }
}

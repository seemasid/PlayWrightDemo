import { PageActions } from "../lib/PageActions";

export class AmazonPage {
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
        this.pageUrl = 'https://www.amazon.in';
        this.searchBar = 'input#twotabsearchtextbox';
        this.searchBtn = 'input#nav-search-submit-button';
        this.bookName = bookName;
        this.bookPriceLoc = `//span[contains(text(),"${this.bookName}")]/../../../following-sibling::div//div[@data-cy="price-recipe"]//span[@class="a-price"]/span[@class="a-offscreen"]`;
        this.publisher = '#rpi-attribute-book_details-publisher div.rpi-attribute-value';
        this.author = 'span.author>a';
        this.bookDetailsCarousalNext = '#rich_product_information a.a-carousel-goto-nextpage';
        this.isbnLoc = ["div[id='rpi-attribute-book_details-isbn13']", "div[id='rpi-attribute-book_details-isbn10']", "div[id='rpi-attribute-book_details-isbn']"]
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
            bookObj.author = await this.page.locator(this.author).textContent()
            bookObj.publisher = (await this.page.locator(this.publisher).textContent()).replace('Publisher:', '').trim();
            try {
                await this.page.waitForSelector(this.bookDetailsCarousalNext, { timeout: 5000 })
                await this.page.locator(this.bookDetailsCarousalNext).click();
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
                const isbnValue = await this.page.locator(isbnLoc).textContent();
                bookObj.isbn = isbnValue.replace('ISBN-13|ISBN-10','').trim();
            }
        }
        return bookObj;
    }
}
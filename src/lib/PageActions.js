export class PageActions {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {import('@playwright/test').BrowserContext} context
     * @param {string} platform
     */
    constructor(page, context, platform) {
        this.page = page;
        this.context = context;
        this.platform = platform;
        this.isBookFound = false;
        this.bookPrice = 0;
    }

    async navigateToUrl(url) {
        await this.page.goto(url)
    }

    async searchBook({ text, searchBar, searchBtn }) {
        await this.page.locator(searchBar).fill(text);
        await this.page.locator(searchBtn).click();
    }

    async navigateToCheapestBook({ bookPriceLoc, bookClickLoc = null, bookName }) {
        let bookIndex;
        this.isBookFound = false;
        try {
            await this.page.waitForSelector(bookPriceLoc, { timeout: 5000 })
            const booksElement = this.page.locator(bookPriceLoc);
            const prices = (await booksElement.allTextContents()).map((v) => Number(v.replace(/\D/g, "")));
            if (prices.length) {
                this.bookPrice = prices.reduce((a, b) => {
                    if (a > b) {
                        if (b === 0) {
                            return a;
                        } else {
                            return b;
                        }
                    }
                    else if (a === 0) {
                        return b;
                    }
                    return a;

                })
                bookIndex = prices.findIndex((e) => e === this.bookPrice)
                if (this.platform !== 'BooksBuy') {
                    await Promise.all([
                        this.context.waitForEvent('page', { timeout: 5000 }),   // wait for new tab
                        await ((bookClickLoc && this.page.locator(bookClickLoc)) || booksElement).nth(bookIndex).click()        // action that opens new tab
                    ]).catch(() => null);
                } else {
                    const oldUrl = this.page.url();
                    await ((bookClickLoc && this.page.locator(bookClickLoc)) || booksElement).nth(bookIndex).click();
                    const allPages = this.context.pages();
                    const pageInstance = allPages[allPages.length - 1];
                    await pageInstance.waitForURL((url) => {
                        return url.href !== oldUrl
                    }, { waitUntil: 'load' })
                }
                this.isBookFound = true;
            } else { }
        } catch (err) { }
        return { isBookFound: this.isBookFound, bookPrice: this.bookPrice };
    }

    async getTotalCostOfBooks(booksKeys, booksData) {
        const totalCost = { amazon: { total: 0 }, flipkart: { total: 0 }, booksIndia: { total: 0 } }
        booksKeys.forEach((bookName) => {
            let bookQtyCost = booksData[bookName].Amazon.Price * booksData[bookName].Qty;
            totalCost.amazon = { ...totalCost.amazon, [bookName]: bookQtyCost, total: totalCost.amazon.total + bookQtyCost }
            bookQtyCost = booksData[bookName].Flipkart.Price * booksData[bookName].Qty;
            totalCost.flipkart = { ...totalCost.flipkart, [bookName]: bookQtyCost, total: totalCost.flipkart.total + bookQtyCost }
            bookQtyCost = booksData[bookName].BooksIndia.Price * booksData[bookName].Qty;
            totalCost.booksIndia = { ...totalCost.booksIndia, [bookName]: bookQtyCost, total: totalCost.booksIndia.total + bookQtyCost }
        })

        return totalCost;
    }

}
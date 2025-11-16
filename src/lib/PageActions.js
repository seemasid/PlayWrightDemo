import { writeJsonToFile } from "../../utils/utils";


export class PageActions {
    /**
   * @param {import("@playwright/test").Page} page
   * @param {import("@playwright/test").BrowserContext} context
   */
    constructor(page, context, platform) {
        this.page = page;
        this.context = context;
        this.platform = platform;
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
        let bookPrice;
        await this.page.waitForTimeout(5000)
        const booksElement = this.page.locator(bookPriceLoc);
        const prices = (await booksElement.allTextContents()).map((v) => Number(v.replace(/\D/g, "")));
        //console.log({ platform: this.platform, prices })
        if (prices.length) {
            bookPrice = prices.reduce((a, b) => {
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
            bookIndex = prices.findIndex((e) => e === bookPrice)
            if (this.platform !== 'BooksBuy') {
                await Promise.all([
                    this.context.waitForEvent('page'),   // wait for new tab
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
        } else {
            console.log({ bName: bookName })
        }
    }

    async fetchBookData() {
        const allPages = this.context.pages();
        const pageInstance = allPages[allPages.length - 1];
        if (this.platform === 'BooksBuy') {
            await pageInstance.locator('//a[text()="Product Specifications"]').click();
            await this.page.waitForTimeout(5000);
            //writeJsonToFile()
        }
    }

}
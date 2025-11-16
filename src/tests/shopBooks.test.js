import { csvReader } from '../../utils/utils';
import { test } from '../lib/PageManager';
// @ts-ignore

csvReader('../src/resources/bookList.csv').forEach(async ({ title, qty }, index) => {
  test.describe(`Test for value: ${title}-amazon`, () => {
    test.use({ bookName: title, platform: 'Amazon' });
    test(`amazon-${index}`, async ({ amazonPage }) => {
      await test.step(`Navigate to Application`, async () => {
        await amazonPage.navigateToPage();
      });
      await test.step(`Search book`, async () => {
        await amazonPage.searchBook();
      });
      await test.step(`Get books list`, async () => {
        await amazonPage.navigateToCheapestBook();
      });
      await test.step(`Fetch book data`, async () => {
        await amazonPage.fetchBookData();
      });
    });
  })

  test.describe(`Test for value: ${title}-flipkart`, () => {
    test.use({ bookName: title, platform: 'Flipkart' });
    test('flipkart', async ({ flipkartPage }) => {
      await test.step(`Navigate to Application`, async () => {
        await flipkartPage.navigateToPage();
      });
      await test.step(`Search book`, async () => {
        await flipkartPage.searchBook();
      });
      await test.step(`Get books list`, async () => {
        await flipkartPage.navigateToCheapestBook();
      });
      await test.step(`Fetch book data`, async () => {
        await flipkartPage.fetchBookData();
      });
    });
  })

  test.describe(`Test for value: ${title}-booksbuy`, () => {
    test.use({ bookName: title, platform: 'BooksBuy' });
    test('booksbuy', async ({ booksBuyIndiaPage }) => {
      await test.step(`Navigate to Application`, async () => {
        await booksBuyIndiaPage.navigateToPage();
      });
      await test.step(`Search book`, async () => {
        await booksBuyIndiaPage.searchBook();
      });
      await test.step(`Get books list`, async () => {
        await booksBuyIndiaPage.navigateToCheapestBook();
      });
      await test.step(`Fetch book data`, async () => {
        await booksBuyIndiaPage.fetchBookData();
      });
    });
  })
})






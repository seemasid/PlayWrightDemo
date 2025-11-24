
import { csvReader, jsonReader, writeJsonToFile } from '../../utils/utils';
import { test } from '../lib/PageManager';

test.describe('Fetching books from all sites', async () => {
  const booksObj = {};
  csvReader('../src/resources/bookList.csv').forEach(async ({ title, qty }) => {
    let bookFound = true;
    booksObj[title] = {
      "Qty": qty,
      "Amazon": { "Price": 0, "Is available": false, "Publisher": '', "Author": '', 'ISBN': '' },
      "Flipkart": { "Price": 0, "Is available": false, "Publisher": '', "Author": '', 'ISBN': '' },
      "BooksIndia": { "Price": 0, "Is available": false, "Publisher": '', "Author": '', 'ISBN': '' },
    }
    test.describe(`Test suite for fetching ${title} book from amazon`, async () => {
      test.use({ bookName: title, platform: 'Amazon' });
      test(`${title}-amazon`, async ({ amazonPage }) => {
        await test.step(`Navigate to Application`, async () => {
          await amazonPage.navigateToPage();
        });
        await test.step(`Search book`, async () => {
          await amazonPage.searchBook();
        });
        await test.step(`Get books list`, async () => {
          const { isBookFound, bookPrice } = await amazonPage.navigateToCheapestBook();
          bookFound = isBookFound;
          booksObj[title].Amazon.Price = bookPrice;
          booksObj[title].Amazon['Is available'] = bookFound;
        });
        await test.step(`Fetch book data`, async (step) => {
          step.skip(!bookFound, 'book is found fetching book data')
          const bookObj = await amazonPage.fetchBookData();
          booksObj[title].Amazon.Publisher = bookObj.publisher;
          booksObj[title].Amazon.Author = bookObj.author;
          booksObj[title].Amazon.ISBN = bookObj.isbn;
        });
      });
    })

    test.describe(`Test suite for fetching ${title} book from flipkart`, async () => {
      test.use({ bookName: title, platform: 'Flipkart' });
      test(`${title}-flipkart`, async ({ flipkartPage }) => {
        await test.step(`Navigate to Application`, async () => {
          await flipkartPage.navigateToPage();
        });
        await test.step(`Search book`, async () => {
          await flipkartPage.searchBook();
        });
        await test.step(`Get books list`, async () => {
          const { isBookFound, bookPrice } = await flipkartPage.navigateToCheapestBook();
          bookFound = isBookFound;
          booksObj[title].Flipkart.Price = bookPrice;
          booksObj[title].Flipkart['Is available'] = bookFound;
        });
        await test.step(`Fetch book data`, async (step) => {
          step.skip(!bookFound, 'book is found fetching book data')
          const bookObj = await flipkartPage.fetchBookData();
          booksObj[title].Flipkart.Publisher = bookObj.publisher;
          booksObj[title].Flipkart.Author = bookObj.author;
          booksObj[title].Flipkart.ISBN = bookObj.isbn;
        });
      });
    })

    test.describe(`Test suite for fetching ${title} book from booksbuy`, async () => {
      test.use({ bookName: title, platform: 'BooksBuy' });
      test(`${title}-booksbuy`, async ({ booksBuyIndiaPage }) => {
        await test.step(`Navigate to Application`, async () => {
          await booksBuyIndiaPage.navigateToPage();
        });
        await test.step(`Search book`, async () => {
          await booksBuyIndiaPage.searchBook();
        });
        await test.step(`Get books list`, async () => {
          const { isBookFound, bookPrice } = await booksBuyIndiaPage.navigateToCheapestBook();
          bookFound = isBookFound;
          booksObj[title].BooksIndia.Price = bookPrice;
          booksObj[title].BooksIndia['Is available'] = bookFound;
        });
        await test.step(`Fetch book data`, async (step) => {
          step.skip(!bookFound, 'book is found fetching book data')
          const bookObj = await booksBuyIndiaPage.fetchBookData();
          booksObj[title].BooksIndia.Publisher = bookObj.publisher;
          booksObj[title].BooksIndia.Author = bookObj.author;
          booksObj[title].BooksIndia.ISBN = bookObj.isbn;
        });
      });
    })
  })

  test.afterAll(async () => {
    writeJsonToFile(booksObj, './results/output.json')
  });
})

test.describe('Conclude which platform is cheaper to buy the set of books and list out total costs in each online retail platform for comparison', async () => {
  test('All books are available on all the sites', async ({ pageActions }) => {
    const booksData = jsonReader('./results/output.json');
    const bookKeys = Object.keys(booksData);
    const filteredBooks = Object.keys(booksData).filter((bookName) => {
      return booksData[bookName].Amazon["Is available"] && booksData[bookName].Flipkart["Is available"] && booksData[bookName].BooksIndia["Is available"]
    })
    if (bookKeys.length === filteredBooks.length) {
      console.log(await pageActions.getTotalCostOfBooks(filteredBooks, booksData))
    } else {
      console.log('fail')
    }
  })
  test('If a book is unavailable on one site, choose the platform where all books are available', async ({ pageActions }) => {
    const booksData = jsonReader('./results/output.json');
    const filteredBooks = Object.keys(booksData).filter((bookName) => {
      return booksData[bookName].Amazon["Is available"] || booksData[bookName].Flipkart["Is available"] || booksData[bookName].BooksIndia["Is available"]
    })
    let filteredTotalCost = await pageActions.getTotalCostOfBooks(filteredBooks, booksData);
    Object.keys(booksData).forEach((bName) => {
      if (!filteredTotalCost?.amazon?.[bName]) {
        delete filteredTotalCost.amazon?.[bName]
      }
      if (!filteredTotalCost?.flipkart?.[bName]) {
        delete filteredTotalCost.flipkart?.[bName]
      }
      if (!filteredTotalCost?.booksIndia?.[bName]) {
        delete filteredTotalCost.booksIndia?.[bName]
      }
    })
    console.log({ filteredTotalCost })
  })
})



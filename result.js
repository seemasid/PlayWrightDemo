import { csvReader, jsonOutputWriter } from "./utils/utils.js";

function check() {
    console.log(csvReader('testData/bookList.csv'))
}

check();
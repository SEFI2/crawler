const runner = require("./crawlers/brg");
const { downloadImage } = require("./utils");

// downloadImage("https://www.google.com/images/srpr/logo3w.png", "google.png");

runner("https://moscow.birge.ru/catalog/rabota_predlagayu/", "https://moscow.birge.ru");

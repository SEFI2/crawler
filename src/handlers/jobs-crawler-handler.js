const runCrawlers = require("../jobs-crawler/runCrawlers");

exports.crawl = async (event, context) => {
  console.log({ event });
  runCrawlers(event.urls);
};

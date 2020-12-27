const runCrawlers = require("../jobs-crawler/runCrawlers");
exports.crawl = async (event, context) => {
  await runCrawlers("http://jerdesh.ru/birge_rabota/jumush_ish");
};

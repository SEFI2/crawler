const { runJerd, runMekn, runHaltur } = require("../jobs-crawler/runCrawlers");
exports.crawlJerd = async (event, context) => {
  await runJerd("http://jerdesh.ru/birge_rabota/jumush_ish");
};

exports.crawlMekn = async (event, context) => {
  await runMekn("http://mekendesh.ru/index.php?page=search&sPattern=&sRegion=&sCategory=101");
};
exports.crawlZherd = async (event, context) => {
  await runMekn("http://zherdeshter.ru/birge_rabota/jumush_ish");
};

exports.crawlHaltur = async (event, context) => {
  await runHaltur("https://halturbek.ru/");
};

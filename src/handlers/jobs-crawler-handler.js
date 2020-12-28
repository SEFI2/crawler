const { runJerd, runMekn } = require("../jobs-crawler/runCrawlers");
exports.crawlJerd = async (event, context) => {
  await runJerd("http://jerdesh.ru/birge_rabota/jumush_ish");
};

exports.crawlMekn = async (event, context) => {
  await runMekn("http://mekendesh.ru/index.php?page=search&sPattern=&sRegion=&sCategory=101");
};

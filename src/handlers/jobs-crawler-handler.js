import runCrawlers from "../jobs-crawler/runCrawlers";

exports.crawl = async (event, context) => {

  console.log(event.urls);
  runCrawlers(event.urls);
};

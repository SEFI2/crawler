const { runCrawlers } = require("../jobs-crawler/runCrawlers");
const axios = require("axios");

exports.crawl = async (event, context) => {
  runCrawlers("http://jerdesh.ru/birge_rabota/jumush_ish");
  return;
  console.log("Yo");
  try {
    const response = await axios.get(event.urls);
    console.log({ resonse: response.status });
  } catch (err) {
    console.log("ERR");
    console.log({ err });
  }
  console.log("fine");
};

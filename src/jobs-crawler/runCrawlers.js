const dotenv = require("dotenv");
const jerdCrawler = require("./crawlers/jerd.js");
const { PublishJob } = require("./utils");
dotenv.config();

const { JERD_URL } = process.env;

const runCrawlers = async (urls) => {
  if (urls.includes(JERD_URL)) {
    console.log("START JERD_URL");
    const results = [];
    for (let i = 1; i <= 2; ++i) {
      const res = await jerdCrawler(`${JERD_URL}/${i}`);
      results.push(...res);
    }
    for (const result of results) {
      await PublishJob(result);
    }
  }
};

module.exports = runCrawlers;

const dotenv = require("dotenv");
const jerdCrawler = require("./crawlers/jerd.js");
const { PublishJob } = require("./utils");
dotenv.config();

const { JERD_URL } = process.env;

const runCrawlers = async (urls) => {
  if (urls.includes(JERD_URL)) {
    const results = await jerdCrawler(JERD_URL);
    for (const result of results) {
      try {
        await PublishJob(result);
      } catch (err) {
        console.log("Cannot publish");
        console.log({ err });
      }
    }
  }
};

module.exports = runCrawlers;

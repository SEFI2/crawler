const dotenv = require("dotenv");
const meknCrawler = require("./crawlers/mekn.js");
const jerdCrawler = require("./crawlers/jerd.js");
const halturCrawler = require("./crawlers/haltur.js");

const { PublishJob } = require("./graphql");
dotenv.config();

const runJerd = async (url) => {
  const results = await jerdCrawler(url);
  for (const result of results) {
    try {
      await PublishJob(result);
    } catch (err) {
      console.log("Cannot publish");
      console.log({ err });
    }
  }
};

const runMekn = async (url) => {
  const results = await meknCrawler(url);
  for (const result of results) {
    try {
      await PublishJob(result);
    } catch (err) {
      console.log("Cannot publish");
      console.log({ err });
    }
  }
};

const runHaltur = async (url) => {
  const results = await halturCrawler(url);
  for (const result of results) {
    try {
      await PublishJob(result);
    } catch (err) {
      console.log("Cannot publish");
      console.log({ err });
    }
  }
};

module.exports = { runJerd, runMekn, runHaltur };

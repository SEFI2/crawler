const dotenv = require("dotenv");

// const brgCrawler = require("./crawlers/brg.js");
const meknCrawler = require("./crawlers/mekn.js");
const jerdCrawler = require("./crawlers/jerd.js");
const halturCrawler = require("./crawlers/haltur.js");
const yntyCrawler = require("./crawlers/ynty.js");
const houseCrawler = require("./crawlers/house.js");

const { PublishJob } = require("./graphql");
dotenv.config();

const runHouse = async (url, mainUrl) => {
  await houseCrawler(url, mainUrl);
};
/*
const runBrg = async (url, mainUrl) => {
  const results = await brgCrawler(url, mainUrl);
  for (const result of results) {
    try {
      await PublishJob(result);
    } catch (err) {
      console.log("Cannot publish");
      console.log({ err });
    }
  }
}; */

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

const runYnty = async (url) => {
  const results = await yntyCrawler(url);
  for (const result of results) {
    try {
      await PublishJob(result);
    } catch (err) {
      console.log("Cannot publish");
      console.log({ err });
    }
  }
};

module.exports = { runHouse, runJerd, runMekn, runHaltur, runBrg, runYnty };

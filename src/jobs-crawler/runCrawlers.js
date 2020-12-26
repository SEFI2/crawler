// const dotenv = require("dotenv");
//const jerdCrawl = require("./crawlers/jerd.js");

// dotenv.config();
const axios = require("axios");

// const { JERD_URL } = process.env;

const runCrawlers = async (urls) => {
  console.log("HERE");
  console.log({ urls });
  try {
    const response = await axios.get(urls);
    console.log({ resonse: response.status });
  } catch (err) {
    console.log({ err });
  }
  console.log("FINE");
  return
  console.log({ urls });
  console.log({ JERD_URL });
  let results = [];
  if (urls.includes(JERD_URL)) {
    const jerdResults = await jerdCrawl(JERD_URL);
    console.log({ jerdResults });
    results.push(...jerdResults);
  }

  results = results.reverse();
  console.log({ results });
  return results;
};

exports.runCrawlers = runCrawlers;

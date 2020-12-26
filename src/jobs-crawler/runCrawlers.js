import dotenv from "dotenv";

import jerdCrawl from "./crawlers/jerd.js";
dotenv.config();

const { JERD_URL } = process.env;

const runCrawlers = async (urls) => {
  let results = [];
  if (urls.includes(JERD_URL)) {
    const jerdResults = await jerdCrawl(JERD_URL);
    results.push(...jerdResults);
  }
  results = results.reverse();
  return results;
};

export default runCrawlers;

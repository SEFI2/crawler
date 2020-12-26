const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { sleep } = require("../utils.js");

const crawlPage = async (pageUrl) => {
  const response = await fetch(pageUrl);
  const $page = cheerio.load(await response.text());
  const header = $page("body div#main h1").text().trim();
  const description = $page("body div#main div#description > p").text().trim();
  const phone = $page("body div#main div#description > a").text().trim();
  const jobDate = $page("body div#main div.item-header strong.publish").text().trim();
  const location = $page("body div#main div.item-header ul#item_location > li").first().text().trim();
  const job = {
    title: header,
    description,
    phone,
    location,
    jobDate
  };
  console.log({ job });
  return job;
};

const jerdCrawler = async (url) => {
  console.log({ url });
  const response = await fetch(url);
  const $ = cheerio.load(await response.text());
  const pageUrls = [];

  $("body div#main ul.listing-card-list > li > a").each((i, el) => {
    const url = $(el).attr("href");
    if (i === 0 || i === 1) { pageUrls.push(url); }
  });

  const results = [];
  await pageUrls.reduce(async (prevPromise, url) => {
    const job = await prevPromise;
    if (job) {
      results.push(job);
    }
    await sleep(1000);
    return crawlPage(url);
  }, Promise.resolve());
  return results;
};

module.exports = jerdCrawler;

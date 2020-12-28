const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { sleep } = require("../utils.js");

const crawlPage = async (pageUrl) => {
  const response = await fetch(pageUrl);
  const $page = cheerio.load(await response.text());
  const header = $page("body div.info__title > h1.title__text").text().trim();
  const price = $page("body div.info__price > span").text().trim();
  const phone = $page("body div.info__title-2 > div.phone_telephone").text().trim();
  const jobDate = $page("body div.info__title-2 > span.item_disbox").eq(0).text().trim();
  const location = $page("body div.info__title-2 > span.item_disbox").eq(1).text().trim();
  const description = $page("body div.ad__description > p.description__text").text().trim();
  const job = {
    title: `${header}. ${price}`,
    description,
    phone,
    location,
    jobDate
  };
  console.log({ job });
  return job;
};

const halturCrawler = async (url) => {
  console.log({ url });
  const response = await fetch(url);
  const $ = cheerio.load(await response.text());
  const pageUrls = [];
  $("body div.products div.product div.product__title > a").each((i, el) => {
    const url = $(el).attr("href");
    pageUrls.push(url);
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

module.exports = halturCrawler;

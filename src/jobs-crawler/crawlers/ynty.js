const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { sleep } = require("../utils.js");

const crawlPage = async (pageUrl) => {
  const response = await fetch(pageUrl);
  const $page = cheerio.load(await response.text());
  const header = $page("body div.basic > h1").text().trim();
  const description = $page("body div.data > div.description > div.text").text().trim();
  const phone = $page("body div.sold-by a.mobile").attr("data-phone");
  const jobDate = $page("body div.pre-basic").find("span.date:last").text().trim();
  const location = $page("body div.pre-basic > a.location").text().trim();

  const job = {
    title: header,
    description,
    phone,
    location,
    jobDate
  };
  return job;
};

const yntyCrawler = async (url) => {
  console.log({ url });
  const response = await fetch(url);
  const $ = cheerio.load(await response.text());
  const pageUrls = [];

  $("body div.products div.data > a.title").each((i, el) => {
    const url = $(el).attr("href");
    pageUrls.push(url);
  });

  const results = [];
  await pageUrls.reduce(async (prevPromise, url) => {
    const job = await prevPromise;
    if (job) {
      console.log({ job });
      results.push(job);
    }
    await sleep(1000);
    return crawlPage(url);
  }, Promise.resolve());
  return results.reverse();
};

module.exports = yntyCrawler;

const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { sleep } = require("../utils.js");

const crawlPage = async (pageUrl) => {
  const response = await fetch(pageUrl);
  const $page = cheerio.load(await response.text());
  const header = $page("body div.add-content > div.left-side > h1.name_ads").text().trim();
  const description = $page("body div.add-content > div.left-side > div.ads_field").text().trim();
  const phone = $page("body div.add-content > div.right-side > div.contact > div.city-date").text().trim();
  const jobDate = $page("body div.add-content > div.left-side > div.locate > div.city-date").text().trim();
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

const brgCrawler = async (url) => {
  console.log({ url });
  const response = await fetch(url);
  const $ = cheerio.load(await response.text());
  const pageUrls = [];
  $("body div.catalog_content > div.listitem_catalog > div.catalog_item > a.href-detail").each((i, el) => {
    const href = $(el).attr("href");
    const code = href.split("/")[3];
    if (i === 0) pageUrls.push(`${url}${code}/`);
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

module.exports = brgCrawler;

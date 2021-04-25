const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { sleep, downloadImage } = require("../utils.js");
const tesseract = require("node-tesseract-ocr");

const crawlPage = async (pageUrl, mainUrl) => {
  console.log({ pageUrl });
  const response = await fetch(pageUrl);
  const $page = cheerio.load(await response.text());

  const phoneUrl = $page("body div.add_content > div.right-side > div.contact div.contacts img.dont_copy_phone").attr("src").trim();

  await downloadImage(`${mainUrl}${phoneUrl}`, "phone.png");

  const phone = await tesseract.recognize("phone.png", {
    oem: 1,
    psm: 3,
    tessedit_char_whitelist: "0123456789",
  });
  const header = $page("body div.add_content > div.left-side > h1.name_ads").text().trim();
  const description = $page("body div.add_content > div.left-side > div.ads_field").text().trim();
  const jobDate = $page("body div.add_content > div.left-side > div.locate > div.city-date").eq(1).text().trim();
  const location = $page("body div.add_content > div.right-side > div.contact > div.contacts").eq(2).text().trim();
  const job = {
    title: header,
    description,
    phone: phone.replace(/\D/g, ""),
    location,
    jobDate
  };
  console.log({ job });
  return job;
};

const brgCrawler = async (url, mainUrl, page) => {
  console.log({ url });
  const response = await fetch(`${url}?PAGEN_1=${page}`);
  const $ = cheerio.load(await response.text());
  const pageUrls = [];
  $("body div.catalog_content > div.listitem_catalog > div.catalog_item > a.href-detail").each((i, el) => {
    const href = $(el).attr("href");
    const code = href.split("/")[3];
    pageUrls.push(`${url}${code}/`);
  });

  const results = [];
  await pageUrls.reduce(async (prevPromise, url) => {
    const job = await prevPromise;
    if (job) {
      results.push(job);
    }
    await sleep(1000);
    return crawlPage(url, mainUrl);
  }, Promise.resolve());
  console.log({ pageUrls });
  return results.reverse();
};

module.exports = brgCrawler;

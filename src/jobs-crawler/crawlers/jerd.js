const cheerio = require("cheerio");
const axios = require("axios");
const { sleep } = require("../utils.js");

const crawlPage = async (pageUrl) => {
  console.log({ pageUrl });
  const response = await axios.get(pageUrl);
  console.log({ response });
  const $page = cheerio.load(response.data);
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

const crawlList = async (url) => {
  console.log({ url });
  console.log("heLLO");
  let response;
  try {
    response = await axios.get(url);
  } catch (err) {
    console.log({ err });
  }
  // console.log({ response: response.data });
  console.log("here1");
  const $ = cheerio.load(response.data);
  const pageUrls = [];

  console.log("here2");
  $("body div#main ul.listing-card-list > li > a").each((i, el) => {
    const url = $(el).attr("href");
    pageUrls.push(url);
  });
  console.log("here3");

  const results = [];
  pageUrls.reduce(async (prevPromise, url) => {
    results.push(await prevPromise);
    await sleep(2000);
    return crawlPage(url);
  }, Promise.resolve());
  return results;
};

const jerd = async (url) => {
  console.log({ url });
  const results = [];
  try {
    for (let i = 1; i <= 5; ++i) {
      const res = await crawlList(`${url}/${i}`);
      results.push(...res);
      await sleep(2000);
    }
  } catch (err) {
    console.log({ err });
    // console.log("ERROR");
  }
  return results;
};

module.exports = jerd;

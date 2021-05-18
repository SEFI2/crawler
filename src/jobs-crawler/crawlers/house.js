const cheerio = require("cheerio");
const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { sleep } = require("../utils.js");
const TelegramBot = require("node-telegram-bot-api");
const token = "1721591920:AAH5pHPAENB4tWuFN60IjBGrmIpzgMt_YNM";
const bot = new TelegramBot(token, { polling: true });
const chatId = -1001283290172;

const dumpPath = "/tmp/dump.json";
let browser;
let dump;

const hashCode = function (s) {
  let h = 0; const l = s.length; let i = 0;
  if (l > 0) {
    while (i < l) { h = (h << 5) - h + s.charCodeAt(i++) | 0; }
  }
  return h;
};

const crawlPage = async (pageUrl, mainUrl) => {
  const response = await fetch(pageUrl);
  const $page = cheerio.load(await response.text());

  const title = $page("body section.c-details__content > div.c-details__top h2.c-details__top-heading").text().trim().replace(/\s\s+/g, " ");
  const pricePrimary = $page("body section.c-details__content > div.c-details__top span.c-details__price--primary").text().trim().replace(/\s\s+/g, " ");
  const priceSecondary = $page("body section.c-details__content > div.c-details__top span.c-details__price--secondary").text().trim().replace(/\s\s+/g, " ");
  const location = $page("body section.c-details__content > div.c-details__top span.c-details__top-text").text().trim().replace(/\s\s+/g, " ");
  const description = $page("body section.c-details__content > div.c-details__block p.c-details__desc").text().trim().replace(/\s\s+/g, " ");
  const phone = $page("body section.c-details__sidebar div.c-sticky-card__phone").text().trim().replace(/\s\s+/g, " ");

  const hash = hashCode(`${title}${pricePrimary}${phone}${location}`);
  if (dump[hash] === true) {
    console.log(`${hash} Already exists`);
    return;
  }
  dump[hash] = true;

  const page = await browser.newPage();
  await page.goto(pageUrl);
  const loadedImages = await page.evaluate(() => Array.from(document.querySelectorAll("div[class=flickity-slider] img[class=c-gallery__nav-img]"), element => element.src));
  const lazyImages = (await page.evaluate(
    () => Array.from(
      document.querySelectorAll("div[class=flickity-slider] img[class=c-gallery__nav-img]"),
      element => element.getAttribute("data-flickity-lazyload")
    )
  )).filter(im => im !== null && im.length > 0).map(im => `${mainUrl}${im}`);

  const images = [...loadedImages, ...lazyImages].filter(im => im !== null && im.length > 0).map(im => im.split("?")[0]).map(im => im + "?w=150&h=150");

  const header = `${title} - ${pricePrimary}`;
  const body = `${description}\n🚇${location}\n📞${phone}\n💵${pricePrimary}\n💲${priceSecondary}`;
  const text = `🔔🙈🙉🙊\n*${header}*\n${body}\n` + (images ? "*Фото*👇👇👇" : "*Нет фото*");

  await bot.sendMessage(chatId, text, {
    disable_notification: true,
    disable_web_page_preview: true,
    parse_mode: "markdown"
  });

  if (!images || images.length === 0) {
    console.log("No images");
    return;
  }

  const mediaGroup = [];
  for (let i = 0; i < images.length && i < 6; ++i) {
    mediaGroup.push({ type: "photo", media: images[i] });
  }
  console.log({ mediaGroup });

  await bot.sendMediaGroup(chatId, mediaGroup, {
    disable_notification: true,
    disable_web_page_preview: true,
    caption: text
  });
  return true;
};

const houseCrawler = async (url, mainUrl) => {
  console.log({ url, mainUrl });
  browser = await puppeteer.launch({ headless: true });
  if (!(await fs.existsSync(dumpPath))) {
    await fs.writeFileSync(dumpPath, JSON.stringify({}));
  }

  dump = JSON.parse(await fs.readFileSync("/tmp/dump.json"));

  const response = await fetch(url);
  const $ = cheerio.load(await response.text());
  // console.log({res: await response.text()});
  // console.log($.html());
  const pageUrls = [];
  $("body section.c-listing__content > div.c-listing__cards > div.c-listing__card a.c-card__link").each((i, el) => {
    const href = $(el).attr("href");
    pageUrls.push(`${mainUrl}${href}`);
  });

  console.log({ pageUrls });

  const results = [];
  try {
    await pageUrls.reduce(async (prevPromise, url) => {
      const job = await prevPromise;
      if (job) {
        results.push(job);
      }
      await sleep(30000);
      return crawlPage(url, mainUrl);
    }, Promise.resolve());
  } catch (err) {
    console.log({ err });
    await fs.writeFileSync(dumpPath, JSON.stringify(dump));
  }
};

module.exports = houseCrawler;

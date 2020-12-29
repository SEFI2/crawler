const fs = require("fs");
const request = require("request");

const downloadImage = (uri, filename, callback) => {
  return new Promise((resolve, reject) => {
    request.head(uri, (err, res, body) => {
      if (err) {
        reject(err);
      }
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);
      request(uri).pipe(fs.createWriteStream(filename, { flags: "w" }))
        .on("close", () => {
          resolve();
        }).on("error", err => {
          reject(err);
        });
    });
  });
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = { sleep, downloadImage };

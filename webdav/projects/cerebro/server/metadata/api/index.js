const { getMetadata } = require("page-metadata-parser");
const domino = require("domino");
const axios = require("axios");

module.exports = async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  
  let url = req.url
    .slice(1)
    .replace("https:/", "https://")
    .replace("http:/", "http://");

  if (!url.startsWith("https") || !url.startsWith("http")) {
    url = "https://" + url; // add protocol if missing
  }

  const html = await axios.get(url);
  console.log(html);
  const doc = domino.createWindow(html).document;
  const metadata = getMetadata(doc, url);

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/json`);
  res.end(JSON.stringify(metadata));
};

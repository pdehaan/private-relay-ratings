#!/usr/bin/env node

const arg = require("arg");

const fetchAddonReviews = require("./api");
const { addonId } = require("./package.json");

const args = arg({
  // Types
  "--score": Number,

  // Aliases
  "-s": "--score",
});

main(addonId, args["--score"]);

async function main(addon, score = undefined) {
  const reviews = await fetchAddonReviews(addon, { page: 1, score });

  console.log(
    "https://addons.mozilla.org/firefox/addon/private-relay/reviews/"
  );
  for (const result of reviews) {
    const created = new Date(result.created).toLocaleDateString("en-US");
    console.log(`
      [name=${result.user.name}]
      [score=${result.score}] ${"✯ ".repeat(result.score).trim()}
      [created=${created}]
      ${result.body.trim().replace(/\n/g, " ")}`);

    if (result.reply) {
      console.log(`
        REPLY::
        [name=${result.reply.user.name}]
        [created=${result.reply.created}]
        ${result.reply.body.trim().replace(/\n/g, " ")}`);
    }
    console.log("");
  }
}

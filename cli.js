#!/usr/bin/env node

const arg = require("arg");

const fetchAddonReviews = require("./api");
const { addonId } = require("./package.json");

const args = arg({
  // Types
  "--score": Number,
  "--since": String,

  // Aliases
  "-s": "--score",
});

const params = {
  score: args["--score"],
  since: args["--since"]
};

main(addonId, params);

async function main(addon, params={}) {
  const reviews = await fetchAddonReviews(addon, { page: 1, ...params });
  const baseUrl = "https://addons.mozilla.org/firefox/addon/private-relay/reviews/"

  console.log(baseUrl);
  for (const result of reviews) {
    const created = new Date(result.created).toLocaleDateString("en-US");
    console.log(`
name: ${result.user.name}
score: ${result.score} ${"✯ ".repeat(result.score).trim()}
created: ${new Date(created).toLocaleDateString()}
url: ${baseUrl}${result.id}
${result.body.trim().replace(/\n/g, " ")}`);

    if (result.reply) {
      console.log(`
\tREPLY::
\tname: ${result.reply.user.name}
\tcreated: ${new Date(result.reply.created).toLocaleDateString()}
\t${result.reply.body.trim().replace(/\n/g, " ")}`);
    }
    console.log("");
  }
}

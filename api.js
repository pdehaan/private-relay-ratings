const axios = require("axios");
const ms = require("ms");

async function fetchAddonReviews(addon, opts = { page: 1 }) {
  let sinceMs = 0;
  if (opts.since) {
    const age = Math.abs(ms(opts.since));
    sinceMs = new Date(Date.now() - age).getTime();
  }
  return axios
    .get("https://addons.mozilla.org/api/v4/ratings/rating/", {
      params: {
        addon,
        page_size: 100,
        ...opts,
      },
    })
    .then((res) => res.data)
    .then(({ results }) => {
      return (
        results
          // Ignore reviews with no text.
          .filter((result) => result.body !== null)
          // Short circuit for ignoring results with existing responses.
          .filter((result) => !result.reply)
          // Filter out results by date.
          .filter((result) => {
            if (opts.since) {
              return new Date(result.created).getTime() >= sinceMs;
            }
            return true;
          })
          // Sort by date created (descending/newest first)
          .sort((a, b) => b.created.localeCompare(a.created))
      );
    });
}

module.exports = fetchAddonReviews;

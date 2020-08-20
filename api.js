const axios = require("axios");

async function fetchAddonReviews(addon, opts = {page: 1}) {
  return axios
    .get("https://addons.mozilla.org/api/v4/ratings/rating/", {
      params: {
        addon,
        page_size: 100,
        ...opts
      },
    })
    .then((res) => res.data)
    .then(({results}) => {
      return results
            // Ignore reviews with no text.
            .filter((result) => result.body !== null)
            // Short circuit for ignoring results with existing responses.
            .filter((result) => !result.reply)
            // Sort by date created (descending/newest first)
            .sort((a, b) => b.created.localeCompare(a.created))
    });
}

module.exports = fetchAddonReviews;

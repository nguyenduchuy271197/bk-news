const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");

app.locals.dateFns = require("date-fns");

app.get("/", (req, res) => {
  res.render("home", {
    title: "Search Hacker News",
  });
});

async function searchHN(query) {
  const response = await axios.get(
    `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`
  );
  return response.data;
}

app.get("/search", async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      res.redirect(302, "/");
      return;
    }

    const results = await searchHN(searchQuery);
    res.render("search", {
      title: `Search results for: ${searchQuery}`,
      searchResults: results,
      searchQuery,
    });
  } catch (err) {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.set("Content-Type", "text/html");
  res.status(500).send("<h1>Internal Server Error</h1>");
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`BK news server started on port: ${server.address().port}`);
});

require("dotenv").config();
const config = process.env;
const express = require("express");
const app = express();
const apiRoutes = express.Router();
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

apiRoutes.post(
  "/search",
  asyncHandler(async (req, res) => {
    const url = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${req.body.search}&api-key=${config.NYT_API_KEY}&begin_date=20210501&end_date=20211026`;
    const { data } = await axios.get(url);
    res.status(200).json(data);
  })
);

app.use("/api/v1", apiRoutes);

// app.get(
//   "/magazine",
//   asyncHandler(async (req, res) => {
//     const url = `https://api.nytimes.com/svc/topstories/v2/magazine.json?api-key=${config.NYT_API_KEY}`;
//     const { data } = await axios.get(url);
//     res.status(200).json(data);
//   })
// );

// app.get(
//   "/search/:searchTerm",
//   asyncHandler(async (req, res) => {
//     const url = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${req.params.searchTerm}&api-key=${config.NYT_API_KEY}&begin_date=20210701&end_date=20210729`;

//     const { data } = await axios.get(url);
//     res.status(200).json(data);
//   })
// );
const errorHandler = (req, res, err) => {
  console.log(err.stack);
  res.status(err.statusCode || 500).json({ success: false, messsage: err });
};

app.use(errorHandler);
// gcloud functions deploy helloGCS --runtime nodejs14 --trigger-resource audio-articles --trigger-event google.storage.object.finalize

const port = process.env.PORT || 5000;
const server = app.listen(port, (err) => {
  if (err) {
    server.close();
  }
  console.log(`Server listening on port ${port}!`);
});

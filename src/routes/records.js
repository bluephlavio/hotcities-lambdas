const express = require("express");
const Record = require("../models/record");
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware,
  extraMiddleware,
} = require("../middlewares/common");

const { list, get } = require("../controllers/common");
const { current, hottest, coolest } = require("../controllers/records");

const router = express.Router();

router.get(
  "/",
  filterMiddleware("geonameid", "temp", "timestamp"),
  sortMiddleware(),
  paginationMiddleware(),
  extraMiddleware(),
  list(Record)
);

router.get("/current", extraMiddleware(), current());

router.get("/hottest", extraMiddleware(), hottest());

router.get("/coolest", extraMiddleware(), coolest());

router.get("/:id", matchMiddleware(), extraMiddleware(), get(Record));

module.exports = router;

const _ = require("lodash");
const State = require("../models/state");

module.exports.live = () => async (req, res, next) => {
  try {
    const data = await State.findOne().select("-stats.ranking");
    if (!data) res.status(500).json({ error: "Server error." });
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports.stats = () => async (req, res, next) => {
  try {
    const { stats: data } = await State.findOne().select("-current");
    if (!data) res.status(500).json({ error: "Server error." });
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

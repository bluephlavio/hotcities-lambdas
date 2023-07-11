const _ = require("lodash");
const Record = require("../models/record");

module.exports.list = () => async (req, res, next) => {
  try {
    const ranking = await Record.ranking();
    const temprange = await Record.tempRange();
    const skip = res.skip || 0;
    const limit = res.limit || 0;
    const match = res.match;
    const sort = res.sort || {};
    const extra = res.extra || [];
    const data = {
      ranking: _.chain(ranking)
        .filter((entry) => {
          return !!match
            ? _.every(
                Object.keys(match).map((field) => entry[field] === match[field])
              )
            : true;
        })
        .map((entry) => {
          const { geonameid, recordfrac, recordtemp, score, rank } = entry;
          return Object.assign(
            { geonameid, recordfrac, recordtemp, score, rank },
            ...extra.map((field) => ({ [field]: entry[field] }))
          );
        })
        .orderBy(
          Object.keys(sort),
          Object.keys(sort).map((key) => (sort[key] === 1 ? "asc" : "desc"))
        )
        .slice(skip, limit ? skip + limit : undefined)
        .value(),
      temprange,
    };
    res.status(200).send({ data, pagination: { skip, limit } });
  } catch (err) {
    next(err);
  }
};

module.exports.get = () => async (req, res, next) => {
  try {
    const ranking = await Record.ranking();
    const match = res.match;
    const extra = res.extra || [];
    const data = _.chain(ranking)
      .map((entry) => {
        const { geonameid, recordfrac, recordtemp, score, rank } = entry;
        return Object.assign(
          { geonameid, recordfrac, recordtemp, score, rank },
          ...extra.map((field) => ({ [field]: entry[field] }))
        );
      })
      .find((entry) => {
        const fields = Object.keys(match);
        return _.some(
          fields,
          (field) => String(entry[field]) === String(match[field])
        );
      })
      .value();
    if (!data) return next({ message: "Not found.", code: 404 });
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

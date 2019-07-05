const _ = require('lodash');

module.exports.list = () => (req, res, next) => {
  try {
    const { stats, skip, limit } = res;
    res.status(200).send({ data: stats, pagination: { skip, limit } });
  } catch (err) {
    next(err);
  }
};

module.exports.get = () => (req, res, next) => {
  try {
    const { stats, match } = res;
    const cityStats = _.find(stats, entry => {
      const fields = Object.keys(match);
      return _.some(
        fields,
        field => String(entry[field]) === String(match[field])
      );
    });
    if (!cityStats) return next({ message: 'Not found.', code: 404 });
    const rank = _.findIndex(stats, entry => entry._id === cityStats._id) + 1;
    const data = {
      ...cityStats,
      rank
    };
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

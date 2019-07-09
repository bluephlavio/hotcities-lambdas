const City = require('../models/city');

module.exports.list = model => async (req, res, next) => {
  try {
    const match = res.match;
    const sort = res.sort;
    const skip = res.skip || 0;
    const limit = res.limit || 0;
    const extra = res.extra;
    const cursor = model.aggregate();
    if (match) cursor.match(match);
    if (sort) cursor.sort(sort);
    if (skip) cursor.skip(skip);
    if (limit) cursor.limit(limit);
    if (extra) {
      cursor
        .lookup({
          from: 'cities',
          localField: 'geonameid',
          foreignField: 'geonameid',
          as: 'city'
        })
        .unwind('$city')
        .addFields(
          Object.assign(
            {},
            ...extra.map(field => ({ [field]: `$city.${field}` }))
          )
        )
        .project({
          city: 0
        });
    }
    cursor.project({ __v: 0 });
    const data = await cursor.exec();
    return res.status(200).json({ data, pagination: { skip, limit } });
  } catch (err) {
    next(err);
  }
};

module.exports.get = model => async (req, res, next) => {
  try {
    const match = res.match;
    const extra = res.extra || [];
    const data = await model.findOne(match).select('-__v');
    const { geonameid } = data;
    const city = await City.findOne({ geonameid });
    const dataWithExtras = Object.assign(
      data.toObject(),
      ...extra.map(field => ({ [field]: city[field] }))
    );
    if (!data) return next({ message: 'Not found.', code: 404 });
    return res.status(200).json({ data: dataWithExtras });
  } catch (err) {
    next(err);
  }
};

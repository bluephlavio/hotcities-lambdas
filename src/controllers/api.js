module.exports.get = () => async (req, res) => {
  const { cursor } = res;
  const data = await cursor.exec();
  return res.status(200).json(data);
};

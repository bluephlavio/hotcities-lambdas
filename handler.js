module.exports.run = function(event, context, callback) {
  const res = {
    message: 'Hello World!',
    event,
    context
  };
  callback(null, res);
};

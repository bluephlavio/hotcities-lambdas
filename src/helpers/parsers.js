const parseString = s => {
  if (s) {
    const n = Number(s);
    if (n || n === 0) {
      return n;
    }
    if (Date.parse(s)) {
      return new Date(s);
    }
  }
  return s;
};

const parseFilterQueryParam = key => value => {
  const elements = value.split(',');
  const rules = elements.map(e => {
    if (e.startsWith('>')) {
      return { [key]: { $gt: parseString(e.slice(1)) } };
    } else if (e.startsWith('<')) {
      return { [key]: { $lt: parseString(e.slice(1)) } };
    } else {
      return { [key]: parseString(e) };
    }
  });
  const query = {};
  for (const rule of rules) {
    for (const key in rule) {
      if (query[key]) {
        Object.assign(query[key], rule[key]);
      } else {
        Object.assign(query, rule);
      }
    }
  }
  return query;
};

module.exports = {
  parseString,
  parseFilterQueryParam
};

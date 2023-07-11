const parseString = (s) => {
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

const parseFilterQueryParam = (key) => (value) => {
  const elements = value.split(",");
  const rules = elements.map((e) => {
    if (e.startsWith(">")) {
      return { [key]: { $gt: parseString(e.slice(1)) } };
    } else if (e.startsWith("<")) {
      return { [key]: { $lt: parseString(e.slice(1)) } };
    } else {
      return { [key]: parseString(e) };
    }
  });
  const match = {};
  rules.forEach((rule) => {
    for (const key in rule) {
      if (match[key]) {
        Object.assign(match[key], rule[key]);
      } else {
        Object.assign(match, rule);
      }
    }
  });
  return match;
};

const parseSortQueryParam = (value) => {
  const elements = value.split(",");
  const rules = elements.map((e) =>
    e.startsWith("-") ? { [e.slice(1)]: -1 } : { [e]: 1 }
  );
  const sort = {};
  rules.forEach((rule) => {
    Object.assign(sort, rule);
  });
  return sort;
};

module.exports = {
  parseString,
  parseFilterQueryParam,
  parseSortQueryParam,
};

module.exports.formatTemp = temp =>
  `${Math.round(temp)}°C/${Math.round(1.8 * temp + 32)}°F`;

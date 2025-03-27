const countries = require('./all-countries');
const issNow = require('./iss-now');
const issPass = require('./iss-pass');
module.exports = () => {
  return {
    countries: countries.countries,
    'iss-now': issNow.issNow,
    'iss-pass': issPass.issPass
  }
};

import { ISS_CURRENT_URL, ISS_FUTURE_URL } from '../../../apis/endpoints';
import { getLocationCoordinates } from '../utils/iss/getCoords';
import { fetchWithRetries } from './BaseService';

export function fetchCurrentPosition(transport = {}) {
  return fetchWithRetries({url: ISS_CURRENT_URL, transport, callback: getLocationCoordinates}, 3);
}

export function buildFutureUrl(lat, lon) {
  const findReplace = [
    { find: '%lat%', replace: lat },
    { find: '%lon%', replace: lon },
  ];
  let furtureUrl = ISS_FUTURE_URL;
  findReplace.forEach((replacer) => {
    furtureUrl = furtureUrl.replace(replacer.find, replacer.replace);
  });
  return furtureUrl;
}

export function positionFutureList(selectedCity) {
  return buildFutureUrl(selectedCity.latlng[0], selectedCity.latlng[1]);
}




export function calcRiseTime(res, dateFormat = 'en-GB', dateStyle = 'short', timeStyle = 'short') {
  if(!res?.passes) {
    return false;
  }
  console.log('calcRiseTime', res);

  const now = new Date();
  const riseTimeResult = { found: false };
  for (const time of res.passes) {
    const d = new Date(time.start);
    if (d > now) {
      const riseTimeDisplay =
        riseTimeResult.found = true;
      riseTimeResult.result = new Intl.DateTimeFormat(dateFormat, {
        dateStyle: dateStyle,
        timeStyle: timeStyle,
      }).format(d);
      break;
    }
  }
  return riseTimeResult;
}

export function fetchFuturePositionForLocation(opts) {
  if(!opts.args || !opts.args.latlng) {
    return;
  }
  const url = buildFutureUrl(opts.args.latlng[0], opts.args.latlng[1]);
  const transport = opts.transport;
  return fetchWithRetries({url, transport, callback: calcRiseTime}, 3);
}

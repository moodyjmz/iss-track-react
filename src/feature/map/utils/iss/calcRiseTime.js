
export function calcRiseTime(res, dateFormat = 'en-GB', dateStyle = 'short', timeStyle = 'short') {
    if(!res?.passes) {
      return false;
    }  
    const now = new Date();
    const riseTimeResult = { found: false };
    for (const time of res.passes) {
      const d = new Date(time.start);
      if (d > now) {
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
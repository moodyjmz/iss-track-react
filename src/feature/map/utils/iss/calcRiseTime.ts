interface Pass {
  start: number; 
}

interface Response {
  passes?: Pass[];
}

interface RiseTimeResult {
  found: boolean;
  result?: string; 
}

export function calcRiseTime(
  res: Response,
  dateFormat: string = 'en-GB',
  dateStyle: 'short' | 'medium' | 'long' | 'full' = 'short',
  timeStyle: 'short' | 'medium' | 'long' | 'full' = 'short'
): RiseTimeResult | false {
  if (!res?.passes) {
    return false;
  }

  const now = new Date();
  const riseTimeResult: RiseTimeResult = { found: false };

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
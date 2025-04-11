const logLevels = ['info', 'warn', 'error', 'debug', 'log'] as const;
type LogLevel = typeof logLevels[number];

type Logger = {
  [K in LogLevel]: (...args: unknown[]) => void;
};

const isProduction = process.env.PROD === 'production';

export const logger = logLevels.reduce((methods, level) => {
  const method = level in console ? level : 'log';

  methods[level] = (...args: unknown[]) => {
    if (isProduction && level !== 'error') return;

      console[method].bind(console)(...args);
      // option here to log somewhere else in prod
  };

  return methods;
}, {} as Logger);

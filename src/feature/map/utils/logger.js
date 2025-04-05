class Logger {
    logTypes = ['error', 'warn', 'log', 'info'];
    constructor(levels = {}) {
        for (const key of this.logTypes) {
                this[key] = levels[key] && console[key] ? console[key].bind(console) : this.empty;
          }
    }
    empty() {}
}
const devLogLevels = {error: true, warn: true, log: true, info: true, ree: true};
const prodLogLevels = {};
const LOG_LEVELS = process.env.REACT_APP_APP_ENV === 'production' ? prodLogLevels : devLogLevels;
export const logger = new Logger(LOG_LEVELS);

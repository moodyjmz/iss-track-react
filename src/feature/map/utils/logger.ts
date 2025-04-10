type LogLevel = 'error' | 'warn' | 'log' | 'info';

class Logger {
    private logTypes: LogLevel[] = ['error', 'warn', 'log', 'info'];

    constructor(levels: Partial<Record<LogLevel, boolean>> = {}) {
        this.logTypes.forEach((type) => {
            (this as any)[type] = levels[type] && console[type]
                ? console[type].bind(console)
                : this.empty;
        });
    }

    private empty(): void {
        // No operation
    }
}

const devLogLevels: Partial<Record<LogLevel, boolean>> = {
    error: true,
    warn: true,
    log: true,
    info: true,
};

const prodLogLevels: Partial<Record<LogLevel, boolean>> = {};

const LOG_LEVELS = process.env.REACT_APP_APP_ENV === 'production' ? prodLogLevels : devLogLevels;

export const logger = new Logger(LOG_LEVELS);
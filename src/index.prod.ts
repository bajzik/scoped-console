import type { ScopedLogger, LogLevel, InitConfig } from './types.js'

const noop = () => { }

export function initConsole(_config?: InitConfig): void { }

export function destroyConsole(): void { }

export function useLogger(_scope: string): ScopedLogger {
    return {
        log: noop,
        info: noop,
        warn: noop,
        error: noop,
        debug: noop,
    }
}

export type { ScopedLogger, LogLevel, InitConfig }
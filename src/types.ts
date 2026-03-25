export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface LogEntry {
    scope: string
    file: string
    line: number | null
    column: number | null
    level: LogLevel
    args: unknown[]
    timestamp: number
}

export interface ScopeConfig {
    name: string
    active: boolean
}

export interface InitConfig {
    mount?: string | HTMLElement
}

export interface ScopedLogger {
    log(...args: unknown[]): void
    info(...args: unknown[]): void
    warn(...args: unknown[]): void
    error(...args: unknown[]): void
    debug(...args: unknown[]): void
}
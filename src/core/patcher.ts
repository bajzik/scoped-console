import type { LogLevel } from '../types.js'
import { route } from './router.js'

const original = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
}

export function patchConsole(): void {
    const levels: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug']
    levels.forEach(level => {
        console[level] = (...args: unknown[]) => {
            original[level](...args)
            route(level, args)
        }
    })
}

export function restoreConsole(): void {
    Object.assign(console, original)
}
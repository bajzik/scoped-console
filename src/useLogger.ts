import { defineScope } from './defineScope.js'
import { getCallerLocation } from './core/stackParser.js'
import type { ScopedLogger } from './types.js'

export type { ScopedLogger }

export function useLogger(scope: string): ScopedLogger {
    return {
        log(...args: unknown[]) {
            const loc = getCallerLocation()
            defineScope(scope, loc.file, loc.line, loc.column)
            console.log(...args)
        },
        info(...args: unknown[]) {
            const loc = getCallerLocation()
            defineScope(scope, loc.file, loc.line, loc.column)
            console.info(...args)
        },
        warn(...args: unknown[]) {
            const loc = getCallerLocation()
            defineScope(scope, loc.file, loc.line, loc.column)
            console.warn(...args)
        },
        error(...args: unknown[]) {
            const loc = getCallerLocation()
            defineScope(scope, loc.file, loc.line, loc.column)
            console.error(...args)
        },
        debug(...args: unknown[]) {
            const loc = getCallerLocation()
            defineScope(scope, loc.file, loc.line, loc.column)
            console.debug(...args)
        },
    }
}
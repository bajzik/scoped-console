import type { LogLevel } from '../types.js'
import { store } from './store.js'
import { logStore } from './logStore.js'

export function route(level: LogLevel, args: unknown[]): void {
    const scope = store.getCurrentScope()
    if (scope === null) return

    logStore.add({
        scope,
        file: store.getCurrentFile(),
        line: store.getCurrentLine(),
        column: store.getCurrentColumn(),
        level,
        args,
        timestamp: Date.now(),
    })
}
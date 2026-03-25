import type { LogEntry } from '../types.js'

type LogStoreListener = () => void

function createLogStore() {
    const entries: LogEntry[] = []
    const listeners = new Set<LogStoreListener>()

    function add(entry: LogEntry): void {
        entries.push(entry)
        notifyListeners()
    }

    function getAll(): LogEntry[] {
        return entries
    }

    function clear(): void {
        entries.length = 0
        notifyListeners()
    }

    function subscribe(cb: LogStoreListener): () => void {
        listeners.add(cb)
        return () => listeners.delete(cb)
    }

    function notifyListeners(): void {
        listeners.forEach(cb => cb())
    }

    return {
        add,
        getAll,
        clear,
        subscribe,
    }
}

export const logStore = createLogStore()
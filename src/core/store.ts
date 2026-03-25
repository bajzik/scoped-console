import type { ScopeConfig, LogLevel } from '../types.js'

const STORAGE_KEY = '@bajzik/scoped-console:scopes'
const LEVELS_KEY = '@bajzik/scoped-console:levels'
const POPPED_KEY = '@bajzik/scoped-console:popped'

const ALL_LEVELS: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug']

function loadFromStorage(): Record<string, boolean> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

function saveToStorage(scopes: Map<string, ScopeConfig>): void {
    try {
        const obj: Record<string, boolean> = {}
        scopes.forEach((config, name) => {
            obj[name] = config.active
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
    } catch { }
}

function loadActiveLevels(): Set<LogLevel> {
    try {
        const raw = localStorage.getItem(LEVELS_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as LogLevel[]
            return new Set(parsed)
        }
    } catch { }
    return new Set(ALL_LEVELS)
}

function saveActiveLevels(levels: Set<LogLevel>): void {
    try {
        localStorage.setItem(LEVELS_KEY, JSON.stringify(Array.from(levels)))
    } catch { }
}

function loadPoppedScopes(): Set<string> {
    try {
        const raw = localStorage.getItem(POPPED_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as string[]
            return new Set(parsed)
        }
    } catch { }
    return new Set()
}

function savePoppedScopes(scopes: Set<string>): void {
    try {
        localStorage.setItem(POPPED_KEY, JSON.stringify(Array.from(scopes)))
    } catch { }
}

function createStore() {
    const scopes = new Map<string, ScopeConfig>()
    const persisted = loadFromStorage()
    let currentScope: string | null = null
    let currentFile: string = 'unknown'
    let currentLine: number | null = null
    let currentColumn: number | null = null
    let activeLevels = loadActiveLevels()
    const poppedOutScopes = loadPoppedScopes()

    const listeners = new Set<() => void>()

    function notifyListeners(): void {
        listeners.forEach(cb => cb())
    }

    function registerScope(name: string): void {
        if (scopes.has(name)) return
        scopes.set(name, {
            name,
            active: persisted[name] ?? true,
        })
        saveToStorage(scopes)
        notifyListeners()
    }

    function isActive(scope: string): boolean {
        return scopes.get(scope)?.active ?? false
    }

    function toggleScope(name: string): void {
        const scope = scopes.get(name)
        if (!scope) return
        scope.active = !scope.active
        saveToStorage(scopes)
        notifyListeners()
    }

    function getScopes(): ScopeConfig[] {
        return Array.from(scopes.values())
    }

    function setCurrentScope(name: string, file?: string, line?: number | null, column?: number | null): void {
        registerScope(name)
        currentScope = name
        if (file) currentFile = file
        currentLine = line ?? null
        currentColumn = column ?? null
    }

    function getCurrentScope(): string | null {
        return currentScope
    }

    function getCurrentFile(): string {
        return currentFile
    }

    function getCurrentLine(): number | null {
        return currentLine
    }

    function getCurrentColumn(): number | null {
        return currentColumn
    }

    function getActiveLevels(): Set<LogLevel> {
        return activeLevels
    }

    function toggleLevel(level: LogLevel): void {
        if (activeLevels.has(level)) {
            activeLevels.delete(level)
        } else {
            activeLevels.add(level)
        }
        saveActiveLevels(activeLevels)
        notifyListeners()
    }

    function isLevelActive(level: LogLevel): boolean {
        return activeLevels.has(level)
    }

    function popOutScope(name: string): void {
        poppedOutScopes.add(name)
        savePoppedScopes(poppedOutScopes)
        notifyListeners()
    }

    function returnScope(name: string): void {
        poppedOutScopes.delete(name)
        savePoppedScopes(poppedOutScopes)
        notifyListeners()
    }

    function isPoppedOut(name: string): boolean {
        return poppedOutScopes.has(name)
    }

    function getPoppedOutScopes(): string[] {
        return Array.from(poppedOutScopes)
    }

    function subscribe(cb: () => void): () => void {
        listeners.add(cb)
        return () => listeners.delete(cb)
    }

    return {
        registerScope,
        isActive,
        toggleScope,
        getScopes,
        subscribe,
        setCurrentScope,
        getCurrentScope,
        getCurrentFile,
        getCurrentLine,
        getCurrentColumn,
        getActiveLevels,
        toggleLevel,
        isLevelActive,
        popOutScope,
        returnScope,
        isPoppedOut,
        getPoppedOutScopes,
        ALL_LEVELS,
    }
}

export const store = createStore()
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
})

const { useLogger } = await import('../useLogger.js')
const { store } = await import('../core/store.js')
const { logStore } = await import('../core/logStore.js')
const { patchConsole, restoreConsole } = await import('../core/patcher.js')

describe('useLogger', () => {
    beforeEach(() => {
        logStore.clear()
        patchConsole()
        store.setCurrentScope('initial')
    })

    afterEach(() => {
        restoreConsole()
    })

    it('returns a logger object with all methods', () => {
        const logger = useLogger('TestScope')
        expect(typeof logger.log).toBe('function')
        expect(typeof logger.info).toBe('function')
        expect(typeof logger.warn).toBe('function')
        expect(typeof logger.error).toBe('function')
        expect(typeof logger.debug).toBe('function')
    })

    it('sets scope before logging', () => {
        const logger = useLogger('MyComponent')
        logger.log('hello')
        expect(store.getCurrentScope()).toBe('MyComponent')
    })

    it('logs with correct scope even when another scope was set before', () => {
        store.setCurrentScope('OtherComponent')
        const logger = useLogger('MyComponent')
        logger.log('hello')
        const entries = logStore.getAll()
        const entry = entries.find(e => e.scope === 'MyComponent')
        expect(entry).toBeDefined()
    })

    it('two loggers with different scopes log to correct scopes', () => {
        const loggerA = useLogger('ComponentA')
        const loggerB = useLogger('ComponentB')

        loggerA.log('from A')
        loggerB.log('from B')
        loggerA.warn('warn from A')

        const entries = logStore.getAll()
        const aEntries = entries.filter(e => e.scope === 'ComponentA')
        const bEntries = entries.filter(e => e.scope === 'ComponentB')

        expect(aEntries.length).toBe(2)
        expect(bEntries.length).toBe(1)
    })

    it('logs correct level', () => {
        const logger = useLogger('LevelTest')
        logger.warn('something')
        const entry = logStore.getAll().find(e => e.scope === 'LevelTest')
        expect(entry?.level).toBe('warn')
    })

    it('logs correct args', () => {
        const logger = useLogger('ArgsTest')
        logger.info('user', 42)
        const entry = logStore.getAll().find(e => e.scope === 'ArgsTest')
        expect(entry?.args).toEqual(['user', 42])
    })
})
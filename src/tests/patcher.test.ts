import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
})

const { patchConsole, restoreConsole } = await import('../core/patcher.js')
const { store } = await import('../core/store.js')
const { logStore } = await import('../core/logStore.js')

describe('patcher', () => {
    beforeEach(() => {
        restoreConsole()
        logStore.clear()
        store.setCurrentScope('PatcherTest')
    })

    afterEach(() => {
        restoreConsole()
    })

    it('patches console.log', () => {
        const original = console.log
        patchConsole()
        expect(console.log).not.toBe(original)
    })

    it('patches console.warn', () => {
        const original = console.warn
        patchConsole()
        expect(console.warn).not.toBe(original)
    })

    it('patches console.error', () => {
        const original = console.error
        patchConsole()
        expect(console.error).not.toBe(original)
    })

    it('patches console.info', () => {
        const original = console.info
        patchConsole()
        expect(console.info).not.toBe(original)
    })

    it('patches console.debug', () => {
        const original = console.debug
        patchConsole()
        expect(console.debug).not.toBe(original)
    })

    it('routes console.log to log store', () => {
        patchConsole()
        console.log('test message')
        const entries = logStore.getAll()
        expect(entries.length).toBe(1)
        expect(entries[0].level).toBe('log')
        expect(entries[0].args).toEqual(['test message'])
    })

    it('routes console.warn to log store', () => {
        patchConsole()
        console.warn('watch out')
        const entries = logStore.getAll()
        expect(entries.length).toBe(1)
        expect(entries[0].level).toBe('warn')
        expect(entries[0].args).toEqual(['watch out'])
    })

    it('routes console.error to log store', () => {
        patchConsole()
        console.error('broke')
        const entries = logStore.getAll()
        expect(entries.length).toBe(1)
        expect(entries[0].level).toBe('error')
        expect(entries[0].args).toEqual(['broke'])
    })

    it('restores original console methods', () => {
        const originalLog = console.log
        patchConsole()
        restoreConsole()
        expect(console.log).toBe(originalLog)
    })

    it('restores all methods', () => {
        const originals = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error,
            debug: console.debug,
        }
        patchConsole()
        restoreConsole()
        expect(console.log).toBe(originals.log)
        expect(console.info).toBe(originals.info)
        expect(console.warn).toBe(originals.warn)
        expect(console.error).toBe(originals.error)
        expect(console.debug).toBe(originals.debug)
    })
})
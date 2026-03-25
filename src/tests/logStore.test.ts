import { describe, it, expect, vi } from 'vitest'
import { logStore } from '../core/logStore.js'

describe('logStore', () => {
    it('starts empty', () => {
        logStore.clear()
        expect(logStore.getAll().length).toBe(0)
    })

    it('adds an entry', () => {
        logStore.clear()
        logStore.add({ scope: 'test', level: 'log', args: ['hello'], timestamp: Date.now(), file: 'test.ts', line: 1, column: 1 })
        expect(logStore.getAll().length).toBe(1)
    })

    it('stores correct entry data', () => {
        logStore.clear()
        const entry = { scope: 'MyScope', level: 'warn' as const, args: ['something', 42], timestamp: 1000, file: 'test.ts', line: 1, column: 1 }
        logStore.add(entry)
        const stored = logStore.getAll()[0]
        expect(stored.scope).toBe('MyScope')
        expect(stored.level).toBe('warn')
        expect(stored.args).toEqual(['something', 42])
        expect(stored.timestamp).toBe(1000)
    })

    it('accumulates multiple entries', () => {
        logStore.clear()
        logStore.add({ scope: 'a', level: 'log', args: [], timestamp: 1, file: 'test.ts', line: 1, column: 1 })
        logStore.add({ scope: 'b', level: 'error', args: [], timestamp: 2, file: 'test.ts', line: 1, column: 1 })
        logStore.add({ scope: 'c', level: 'info', args: [], timestamp: 3, file: 'test.ts', line: 1, column: 1 })
        expect(logStore.getAll().length).toBe(3)
    })

    it('clears all entries', () => {
        logStore.add({ scope: 'x', level: 'log', args: [], timestamp: 1, file: 'test.ts', line: 1, column: 1 })
        logStore.clear()
        expect(logStore.getAll().length).toBe(0)
    })

    it('notifies subscribers on add', () => {
        const cb = vi.fn()
        const unsub = logStore.subscribe(cb)
        logStore.add({ scope: 'test', level: 'log', args: [], timestamp: Date.now(), file: 'test.ts', line: 1, column: 1 })
        expect(cb).toHaveBeenCalled()
        unsub()
    })

    it('notifies subscribers on clear', () => {
        const cb = vi.fn()
        const unsub = logStore.subscribe(cb)
        logStore.clear()
        expect(cb).toHaveBeenCalled()
        unsub()
    })

    it('unsubscribes correctly', () => {
        const cb = vi.fn()
        const unsub = logStore.subscribe(cb)
        unsub()
        logStore.add({ scope: 'test', level: 'log', args: [], timestamp: Date.now(), file: 'test.ts', line: 1, column: 1 })
        expect(cb).not.toHaveBeenCalled()
    })

    it('getAll returns entries in insertion order', () => {
        logStore.clear()
        logStore.add({ scope: 'first', level: 'log', args: [], timestamp: 1, file: 'test.ts', line: 1, column: 1 })
        logStore.add({ scope: 'second', level: 'log', args: [], timestamp: 2, file: 'test.ts', line: 1, column: 1 })
        logStore.add({ scope: 'third', level: 'log', args: [], timestamp: 3, file: 'test.ts', line: 1, column: 1 })
        const entries = logStore.getAll()
        expect(entries[0].scope).toBe('first')
        expect(entries[1].scope).toBe('second')
        expect(entries[2].scope).toBe('third')
    })
})
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
})

const { route } = await import('../core/router.js')
const { store } = await import('../core/store.js')
const { logStore } = await import('../core/logStore.js')

describe('router', () => {
    let addSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        addSpy = vi.spyOn(logStore, 'add').mockImplementation(() => { })
    })

    afterEach(() => {
        addSpy.mockRestore()
    })

    it('does not store when no scope is defined', () => {
        vi.spyOn(store, 'getCurrentScope').mockReturnValueOnce(null)
        route('log', ['hello'])
        expect(addSpy).not.toHaveBeenCalled()
    })

    it('stores entry when scope is set', () => {
        store.setCurrentScope('TestScope')
        route('log', ['hello'])
        expect(addSpy).toHaveBeenCalled()
    })

    it('stores correct scope', () => {
        store.setCurrentScope('MyComponent')
        route('warn', ['something'])
        expect(addSpy).toHaveBeenCalledWith(
            expect.objectContaining({ scope: 'MyComponent' })
        )
    })

    it('stores correct level', () => {
        store.setCurrentScope('MyComponent')
        route('error', ['oops'])
        expect(addSpy).toHaveBeenCalledWith(
            expect.objectContaining({ level: 'error' })
        )
    })

    it('stores correct args', () => {
        store.setCurrentScope('MyComponent')
        route('info', ['user', 42, { id: 1 }])
        expect(addSpy).toHaveBeenCalledWith(
            expect.objectContaining({ args: ['user', 42, { id: 1 }] })
        )
    })

    it('stores a timestamp', () => {
        store.setCurrentScope('MyComponent')
        const before = Date.now()
        route('log', ['msg'])
        const after = Date.now()
        const call = addSpy.mock.calls[0][0] as { timestamp: number }
        expect(call.timestamp).toBeGreaterThanOrEqual(before)
        expect(call.timestamp).toBeLessThanOrEqual(after)
    })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'

const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
})

const { store } = await import('../core/store.js')

describe('store', () => {
    beforeEach(() => {
        store.getScopes().forEach(s => {
            if (store.isActive(s.name)) store.toggleScope(s.name)
        })
    })

    it('starts with no scopes', () => {
        expect(store.getScopes().length).toBe(0)
    })

    it('starts with no current scope', () => {
        expect(store.getCurrentScope()).toBeNull()
    })

    it('registers a new scope as active', () => {
        store.registerScope('network')
        const scope = store.getScopes().find(s => s.name === 'network')
        expect(scope?.active).toBe(true)
    })

    it('does not duplicate scopes', () => {
        store.registerScope('ui')
        store.registerScope('ui')
        const scopes = store.getScopes().filter(s => s.name === 'ui')
        expect(scopes.length).toBe(1)
    })

    it('toggles a scope off', () => {
        store.registerScope('auth')
        store.toggleScope('auth')
        expect(store.isActive('auth')).toBe(false)
    })

    it('toggles a scope back on', () => {
        store.registerScope('auth2')
        store.toggleScope('auth2')
        store.toggleScope('auth2')
        expect(store.isActive('auth2')).toBe(true)
    })

    it('notifies subscribers when scope is registered', () => {
        const cb = vi.fn()
        const unsub = store.subscribe(cb)
        store.registerScope('payments')
        expect(cb).toHaveBeenCalled()
        unsub()
    })

    it('notifies subscribers when scope is toggled', () => {
        const cb = vi.fn()
        store.registerScope('toggletest')
        const unsub = store.subscribe(cb)
        store.toggleScope('toggletest')
        expect(cb).toHaveBeenCalled()
        unsub()
    })

    it('unsubscribes correctly', () => {
        const cb = vi.fn()
        const unsub = store.subscribe(cb)
        unsub()
        store.registerScope('after-unsub')
        expect(cb).not.toHaveBeenCalled()
    })

    it('sets and gets current scope', () => {
        store.setCurrentScope('OrderView')
        expect(store.getCurrentScope()).toBe('OrderView')
    })

    it('setCurrentScope also registers the scope', () => {
        store.setCurrentScope('AutoRegistered')
        const scope = store.getScopes().find(s => s.name === 'AutoRegistered')
        expect(scope).toBeDefined()
    })

    it('all levels active by default', () => {
        const levels = ['log', 'info', 'warn', 'error', 'debug'] as const
        levels.forEach(level => {
            expect(store.isLevelActive(level)).toBe(true)
        })
    })

    it('toggles a level off', () => {
        store.toggleLevel('debug')
        expect(store.isLevelActive('debug')).toBe(false)
        store.toggleLevel('debug')
    })

    it('toggles a level back on', () => {
        store.toggleLevel('debug')
        store.toggleLevel('debug')
        expect(store.isLevelActive('debug')).toBe(true)
    })

    it('notifies subscribers when level is toggled', () => {
        const cb = vi.fn()
        const unsub = store.subscribe(cb)
        store.toggleLevel('info')
        expect(cb).toHaveBeenCalled()
        store.toggleLevel('info')
        unsub()
    })

    it('getCurrentFile returns unknown by default', () => {
        expect(store.getCurrentFile()).toBe('unknown')
    })

    it('getCurrentLine returns null by default', () => {
        expect(store.getCurrentLine()).toBeNull()
    })

    it('getCurrentColumn returns null by default', () => {
        expect(store.getCurrentColumn()).toBeNull()
    })

    it('setCurrentScope sets file, line, and column', () => {
        store.setCurrentScope('FileTest', 'test.vue', 42, 10)
        expect(store.getCurrentFile()).toBe('test.vue')
        expect(store.getCurrentLine()).toBe(42)
        expect(store.getCurrentColumn()).toBe(10)
    })

    it('setCurrentScope handles null line and column', () => {
        store.setCurrentScope('NullTest', 'file.ts', null, null)
        expect(store.getCurrentLine()).toBeNull()
        expect(store.getCurrentColumn()).toBeNull()
    })

    it('popOutScope marks scope as popped out', () => {
        store.registerScope('PoppedScope')
        store.popOutScope('PoppedScope')
        expect(store.isPoppedOut('PoppedScope')).toBe(true)
    })

    it('returnScope removes scope from popped out', () => {
        store.registerScope('ReturnScope')
        store.popOutScope('ReturnScope')
        store.returnScope('ReturnScope')
        expect(store.isPoppedOut('ReturnScope')).toBe(false)
    })

    it('getPoppedOutScopes returns array of popped scopes', () => {
        store.registerScope('Pop1')
        store.registerScope('Pop2')
        store.popOutScope('Pop1')
        store.popOutScope('Pop2')
        const popped = store.getPoppedOutScopes()
        expect(popped).toContain('Pop1')
        expect(popped).toContain('Pop2')
        store.returnScope('Pop1')
        store.returnScope('Pop2')
    })

    it('isPoppedOut returns false for non-popped scope', () => {
        store.registerScope('NotPopped')
        expect(store.isPoppedOut('NotPopped')).toBe(false)
    })

    it('notifies subscribers when scope is popped out', () => {
        const cb = vi.fn()
        store.registerScope('PopNotify')
        const unsub = store.subscribe(cb)
        store.popOutScope('PopNotify')
        expect(cb).toHaveBeenCalled()
        store.returnScope('PopNotify')
        unsub()
    })

    it('notifies subscribers when scope is returned', () => {
        const cb = vi.fn()
        store.registerScope('ReturnNotify')
        store.popOutScope('ReturnNotify')
        const unsub = store.subscribe(cb)
        store.returnScope('ReturnNotify')
        expect(cb).toHaveBeenCalled()
        unsub()
    })

    it('getActiveLevels returns a Set', () => {
        const levels = store.getActiveLevels()
        expect(levels instanceof Set).toBe(true)
    })

    it('ALL_LEVELS contains all log levels', () => {
        expect(store.ALL_LEVELS).toEqual(['log', 'info', 'warn', 'error', 'debug'])
    })

    it('toggleScope does nothing for non-existent scope', () => {
        const cb = vi.fn()
        const unsub = store.subscribe(cb)
        store.toggleScope('NonExistent')
        expect(cb).not.toHaveBeenCalled()
        unsub()
    })

    it('isActive returns false for non-existent scope', () => {
        expect(store.isActive('DoesNotExist')).toBe(false)
    })
})
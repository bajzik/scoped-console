import { describe, it, expect, vi } from 'vitest'

const storage: Record<string, string> = {}
vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
})

const { defineScope } = await import('../defineScope.js')
const { store } = await import('../core/store.js')

describe('defineScope', () => {
    it('sets the current scope in store', () => {
        defineScope('OrderView')
        expect(store.getCurrentScope()).toBe('OrderView')
    })

    it('registers the scope in store', () => {
        defineScope('CartService')
        const scope = store.getScopes().find(s => s.name === 'CartService')
        expect(scope).toBeDefined()
    })

    it('overwrites the previous scope', () => {
        defineScope('First')
        defineScope('Second')
        expect(store.getCurrentScope()).toBe('Second')
    })

    it('new scope is active by default', () => {
        defineScope('ActiveByDefault')
        const scope = store.getScopes().find(s => s.name === 'ActiveByDefault')
        expect(scope?.active).toBe(true)
    })
})
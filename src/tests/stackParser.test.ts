import { describe, it, expect } from 'vitest'
import { getCallerLocation } from '../core/stackParser.js'

describe('stackParser', () => {
    describe('getCallerLocation', () => {
        it('returns a CallerLocation object', () => {
            const loc = getCallerLocation()
            expect(loc).toHaveProperty('file')
            expect(loc).toHaveProperty('line')
            expect(loc).toHaveProperty('column')
        })

        it('returns file as string', () => {
            const loc = getCallerLocation()
            expect(typeof loc.file).toBe('string')
        })

        it('returns line as number or null', () => {
            const loc = getCallerLocation()
            expect(loc.line === null || typeof loc.line === 'number').toBe(true)
        })

        it('returns column as number or null', () => {
            const loc = getCallerLocation()
            expect(loc.column === null || typeof loc.column === 'number').toBe(true)
        })
    })
})

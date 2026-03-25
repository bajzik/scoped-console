import { describe, it, expect } from 'vitest'
import { getScopeColor } from '../ui/colors.js'

describe('colors', () => {
    describe('getScopeColor', () => {
        it('returns a hex color string', () => {
            const color = getScopeColor('TestScope')
            expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })

        it('returns consistent color for same scope', () => {
            const color1 = getScopeColor('MyComponent')
            const color2 = getScopeColor('MyComponent')
            expect(color1).toBe(color2)
        })

        it('returns different colors for different scopes', () => {
            const colors = new Set([
                getScopeColor('ComponentA'),
                getScopeColor('ComponentB'),
                getScopeColor('ComponentC'),
                getScopeColor('ComponentD'),
                getScopeColor('ComponentE'),
            ])
            expect(colors.size).toBeGreaterThan(1)
        })

        it('handles empty string', () => {
            const color = getScopeColor('')
            expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })

        it('handles special characters', () => {
            const color = getScopeColor('Test@Scope#123!')
            expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })

        it('handles unicode characters', () => {
            const color = getScopeColor('日本語スコープ')
            expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })

        it('handles very long scope names', () => {
            const longName = 'A'.repeat(1000)
            const color = getScopeColor(longName)
            expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })
    })
})

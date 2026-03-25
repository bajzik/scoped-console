const SCOPE_COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#f97316',
    '#84cc16',
    '#14b8a6',
]

function hashScope(scope: string): number {
    let hash = 0
    for (let i = 0; i < scope.length; i++) {
        hash = (hash << 5) - hash + scope.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

export function getScopeColor(scope: string): string {
    return SCOPE_COLORS[hashScope(scope) % SCOPE_COLORS.length]
}
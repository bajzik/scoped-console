import type { InitConfig } from './types.js'
import { createPanel } from './ui/panel.js'
import { patchConsole, restoreConsole } from './core/patcher.js'

export { useLogger } from './useLogger.js'
export type { ScopedLogger } from './useLogger.js'
export type { LogLevel, InitConfig } from './types.js'

export function initConsole(config: InitConfig = {}): void {
    const { mount = 'body' } = config
    patchConsole()
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init(mount))
    } else {
        init(mount)
    }
}

export function destroyConsole(): void {
    restoreConsole()
}

function init(mount: string | HTMLElement): void {
    const target = typeof mount === 'string'
        ? document.querySelector(mount)
        : mount
    if (!target) {
        console.warn(`[scoped-console] mount target "${mount}" not found`)
        return
    }
    createPanel(target)
}
import { store } from './core/store.js'

export function defineScope(name: string, file?: string, line?: number | null, column?: number | null): void {
    store.setCurrentScope(name, file, line, column)
}
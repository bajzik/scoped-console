import { store } from '../core/store.js'
import { logStore } from '../core/logStore.js'
import type { LogEntry, LogLevel } from '../types.js'
import { PANEL_STYLES } from './styles.js'
import { getScopeColor } from './colors.js'

const HOST_ID = '@bajzik/scoped-console:host'
const PANEL_ID = '@bajzik/scoped-console:panel'
const CONTAINER_ID = '@bajzik/scoped-console:container'
const HEIGHT_KEY = '@bajzik/scoped-console:height'
const COLLAPSED_KEY = '@bajzik/scoped-console:collapsed'
const COLS_KEY = '@bajzik/scoped-console:cols'

const LEVELS: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug']

interface ColWidths {
    time: number
    level: number
    scope: number
    file: number
}

const DEFAULT_COLS: ColWidths = { time: 58, level: 42, scope: 90, file: 140 }

function loadHeight(): number | null {
    try {
        const raw = localStorage.getItem(HEIGHT_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function saveHeight(height: number): void {
    try {
        localStorage.setItem(HEIGHT_KEY, JSON.stringify(height))
    } catch { }
}

function loadCollapsed(): boolean {
    try {
        return localStorage.getItem(COLLAPSED_KEY) === 'true'
    } catch {
        return false
    }
}

function saveCollapsed(collapsed: boolean): void {
    try {
        localStorage.setItem(COLLAPSED_KEY, String(collapsed))
    } catch { }
}

function loadColWidths(): ColWidths {
    try {
        const raw = localStorage.getItem(COLS_KEY)
        return raw ? { ...DEFAULT_COLS, ...JSON.parse(raw) } : DEFAULT_COLS
    } catch {
        return DEFAULT_COLS
    }
}

function saveColWidths(cols: ColWidths): void {
    try {
        localStorage.setItem(COLS_KEY, JSON.stringify(cols))
    } catch { }
}

function applyColWidths(container: HTMLElement, cols: ColWidths): void {
    container.style.setProperty('--col-time', `${cols.time}px`)
    container.style.setProperty('--col-level', `${cols.level}px`)
    container.style.setProperty('--col-scope', `${cols.scope}px`)
    container.style.setProperty('--col-file', `${cols.file}px`)
}

function createStyleElement(): HTMLStyleElement {
    const el = document.createElement('style')
    el.textContent = PANEL_STYLES
    return el
}

function formatTime(timestamp: number): string {
    const d = new Date(timestamp)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '00')
    return `${hh}:${mm}:${ss}`
}

function createValueElement(value: unknown, expanded = false, isNested = false): HTMLElement {
    if (value === null) {
        const span = document.createElement('span')
        span.className = 'scs-val-null'
        span.textContent = 'null'
        return span
    }

    if (value === undefined) {
        const span = document.createElement('span')
        span.className = 'scs-val-undefined'
        span.textContent = 'undefined'
        return span
    }

    if (typeof value === 'string') {
        const span = document.createElement('span')
        span.className = isNested ? 'scs-val-string' : 'scs-val-text'
        span.textContent = isNested ? `"${value}"` : value
        return span
    }

    if (typeof value === 'number') {
        const span = document.createElement('span')
        span.className = 'scs-val-number'
        span.textContent = String(value)
        return span
    }

    if (typeof value === 'boolean') {
        const span = document.createElement('span')
        span.className = 'scs-val-boolean'
        span.textContent = String(value)
        return span
    }

    if (Array.isArray(value)) {
        return createCollapsible(value, 'array', expanded)
    }

    if (typeof value === 'object') {
        return createCollapsible(value as Record<string, unknown>, 'object', expanded)
    }

    const span = document.createElement('span')
    span.textContent = String(value)
    return span
}

function createCollapsible(
    data: unknown[] | Record<string, unknown>,
    type: 'array' | 'object',
    expanded = false
): HTMLElement {
    const isArray = type === 'array'
    const entries = isArray
        ? (data as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
        : Object.entries(data as Record<string, unknown>)
    const length = entries.length

    const container = document.createElement('span')
    container.className = 'scs-collapsible'

    const toggle = document.createElement('span')
    toggle.className = 'scs-toggle'
    toggle.textContent = expanded ? '▼' : '▶'

    const preview = document.createElement('span')
    preview.className = 'scs-preview'
    if (isArray) {
        preview.textContent = `Array(${length})`
    } else {
        const keys = entries.slice(0, 3).map(([k]) => k).join(', ')
        preview.textContent = `{${keys}${length > 3 ? ', …' : ''}}`
    }

    const content = document.createElement('div')
    content.className = 'scs-tree-content'
    content.style.display = expanded ? 'block' : 'none'

    let loaded = false
    function loadContent(): void {
        if (loaded) return
        loaded = true
        entries.forEach(([key, val]) => {
            const row = document.createElement('div')
            row.className = 'scs-tree-row'

            const keySpan = document.createElement('span')
            keySpan.className = isArray ? 'scs-key-index' : 'scs-key-prop'
            keySpan.textContent = key + ': '

            row.appendChild(keySpan)
            row.appendChild(createValueElement(val, false, true))
            content.appendChild(row)
        })
    }

    if (expanded) loadContent()

    toggle.addEventListener('click', (e) => {
        e.stopPropagation()
        const isOpen = content.style.display !== 'none'
        content.style.display = isOpen ? 'none' : 'block'
        toggle.textContent = isOpen ? '▶' : '▼'
        if (!isOpen) loadContent()
    })

    container.appendChild(toggle)
    container.appendChild(preview)
    container.appendChild(content)
    return container
}

function formatArgs(args: unknown[]): HTMLElement {
    const container = document.createElement('span')
    container.className = 'scs-args'

    args.forEach((arg, i) => {
        if (i > 0) {
            const space = document.createElement('span')
            space.textContent = ' '
            container.appendChild(space)
        }
        container.appendChild(createValueElement(arg, false, false))
    })

    return container
}

function getFilteredEntries(scopeFilter?: string): LogEntry[] {
    if (scopeFilter) {
        return logStore.getAll().filter(e => e.scope === scopeFilter)
    }
    const activeScopes = new Set(
        store.getScopes()
            .filter(s => s.active && !store.isPoppedOut(s.name))
            .map(s => s.name)
    )
    return logStore.getAll().filter(e => activeScopes.has(e.scope))
}

function getAllActiveEntries(): LogEntry[] {
    const activeScopes = new Set(
        store.getScopes()
            .filter(s => s.active)
            .map(s => s.name)
    )
    return logStore.getAll().filter(e => activeScopes.has(e.scope))
}

function countByLevel(entries: LogEntry[]): Record<LogLevel, number> {
    const counts: Record<LogLevel, number> = { log: 0, info: 0, warn: 0, error: 0, debug: 0 }
    entries.forEach(e => { counts[e.level]++ })
    return counts
}

function renderBadgesExpanded(el: HTMLElement): void {
    const counts = countByLevel(getAllActiveEntries())
    el.innerHTML = ''
    LEVELS.forEach(level => {
        const count = counts[level]
        if (count === 0) return
        const badge = document.createElement('span')
        badge.className = `scs-badge scs-badge--${level}`
        badge.textContent = `${count} ${level}`
        el.appendChild(badge)
    })
}

function renderBadgesCollapsed(el: HTMLElement): void {
    const counts = countByLevel(getAllActiveEntries())
    el.innerHTML = ''
    LEVELS.forEach(level => {
        const count = counts[level]
        if (count === 0) return
        const badge = document.createElement('span')
        badge.className = `scs-badge scs-badge--${level}`
        const dot = document.createElement('span')
        dot.className = `scs-badge-dot scs-badge-dot--${level}`
        const num = document.createElement('span')
        num.textContent = String(count)
        badge.appendChild(dot)
        badge.appendChild(num)
        el.appendChild(badge)
    })
}

function renderScopes(scopesEl: HTMLElement): void {
    scopesEl.innerHTML = ''

    const scopes = store.getScopes().filter(s => !store.isPoppedOut(s.name))

    if (scopes.length === 0) {
        const msg = document.createElement('span')
        msg.className = 'scs-no-scope'
        msg.textContent = 'No scopes defined yet. Call useLogger() in your components.'
        scopesEl.appendChild(msg)
        return
    }

    scopes.forEach(scope => {
        const color = getScopeColor(scope.name)

        const tab = document.createElement('div')
        tab.className = scope.active
            ? 'scs-scope-tab scs-scope-tab--active'
            : 'scs-scope-tab'

        if (scope.active) {
            tab.style.borderBottom = `2px solid ${color}`
        }

        const dot = document.createElement('span')
        dot.className = 'scs-scope-dot'
        dot.style.background = scope.active ? color : '#444'

        const label = document.createElement('span')
        label.textContent = scope.name

        const popOutBtn = document.createElement('button')
        popOutBtn.className = 'scs-popout-btn'
        popOutBtn.textContent = '⧉'
        popOutBtn.title = 'Open in separate panel'
        popOutBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            store.popOutScope(scope.name)
        })

        tab.appendChild(dot)
        tab.appendChild(label)
        tab.appendChild(popOutBtn)
        tab.addEventListener('click', () => store.toggleScope(scope.name))
        scopesEl.appendChild(tab)
    })
}

function renderLevels(levelsEl: HTMLElement): void {
    levelsEl.innerHTML = ''
    LEVELS.forEach(level => {
        const btn = document.createElement('button')
        btn.className = store.isLevelActive(level)
            ? `scs-level-btn scs-level-btn--${level} scs-level-btn--active`
            : `scs-level-btn scs-level-btn--${level}`
        btn.textContent = level
        btn.addEventListener('click', () => store.toggleLevel(level))
        levelsEl.appendChild(btn)
    })
}

function renderLogs(logsEl: HTMLElement, scopeFilter?: string): void {
    const entries = getFilteredEntries(scopeFilter).filter(
        e => store.isLevelActive(e.level)
    )

    logsEl.innerHTML = ''

    entries.forEach((entry: LogEntry) => {
        const color = getScopeColor(entry.scope)

        const row = document.createElement('div')
        row.className = 'scs-log-entry'
        row.style.borderLeft = `2px solid ${color}`

        const time = document.createElement('span')
        time.className = 'scs-log-time'
        time.textContent = formatTime(entry.timestamp)

        const level = document.createElement('span')
        level.className = `scs-log-level scs-log-level--${entry.level}`
        level.textContent = entry.level

        const scope = document.createElement('span')
        scope.className = 'scs-log-scope'
        scope.textContent = entry.scope
        scope.style.color = color

        const file = document.createElement('span')
        file.className = 'scs-log-file'
        const fileLocation = entry.line !== null
            ? `${entry.file}:${entry.line}${entry.column !== null ? ':' + entry.column : ''}`
            : entry.file
        file.textContent = fileLocation
        file.title = fileLocation

        const message = document.createElement('span')
        message.className = 'scs-log-message'
        message.appendChild(formatArgs(entry.args))

        row.appendChild(time)
        row.appendChild(level)
        row.appendChild(scope)
        row.appendChild(file)
        row.appendChild(message)
        logsEl.appendChild(row)
    })

    logsEl.scrollTop = logsEl.scrollHeight
}

function createColumnHeaders(
    container: HTMLElement,
    cols: ColWidths
): HTMLElement {
    const headers = document.createElement('div')
    headers.className = 'scs-logs-columns'

    const colDefs: Array<{ key: keyof ColWidths; label: string }> = [
        { key: 'time', label: 'Time' },
        { key: 'level', label: 'Level' },
        { key: 'scope', label: 'Scope' },
        { key: 'file', label: 'File' },
    ]

    colDefs.forEach(({ key, label }) => {
        const cell = document.createElement('div')
        cell.className = 'scs-col-header'
        cell.textContent = label

        const resizer = document.createElement('div')
        resizer.className = 'scs-col-resizer'

        resizer.addEventListener('mousedown', (e) => {
            e.stopPropagation()
            e.preventDefault()

            const startX = e.clientX
            const startWidth = cols[key]

            function onMove(e: MouseEvent): void {
                const dx = e.clientX - startX
                cols[key] = Math.max(30, startWidth + dx)
                applyColWidths(container, cols)
            }

            function onUp(): void {
                saveColWidths(cols)
                document.removeEventListener('mousemove', onMove)
                document.removeEventListener('mouseup', onUp)
            }

            document.addEventListener('mousemove', onMove)
            document.addEventListener('mouseup', onUp)
        })

        cell.appendChild(resizer)
        headers.appendChild(cell)
    })

    const msgHeader = document.createElement('div')
    msgHeader.className = 'scs-col-header'
    msgHeader.textContent = 'Message'
    headers.appendChild(msgHeader)

    return headers
}

function makeResizable(panel: HTMLElement): void {
    const handle = document.createElement('div')
    handle.className = 'scs-resize-handle'
    panel.appendChild(handle)

    handle.addEventListener('mousedown', (e) => {
        e.stopPropagation()
        const startY = e.clientY
        const startHeight = panel.offsetHeight

        function onMove(e: MouseEvent): void {
            const dy = startY - e.clientY
            const newHeight = Math.max(100, Math.min(window.innerHeight - 50, startHeight + dy))
            panel.style.height = `${newHeight}px`
        }

        function onUp(): void {
            saveHeight(panel.offsetHeight)
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
    })
}

function createBesidePanel(scopeName: string, cols: ColWidths): HTMLElement {
    const color = getScopeColor(scopeName)

    const panel = document.createElement('div')
    panel.className = 'scs-beside-panel'
    panel.dataset.scope = scopeName

    const header = document.createElement('div')
    header.className = 'scs-beside-header'

    const titleWrapper = document.createElement('div')
    titleWrapper.className = 'scs-beside-title'

    const dot = document.createElement('span')
    dot.className = 'scs-scope-dot'
    dot.style.background = color

    const title = document.createElement('span')
    title.textContent = scopeName
    title.style.color = color

    titleWrapper.appendChild(dot)
    titleWrapper.appendChild(title)

    const returnBtn = document.createElement('button')
    returnBtn.className = 'scs-return-btn'
    returnBtn.textContent = '×'
    returnBtn.title = 'Return to main panel'
    returnBtn.addEventListener('click', () => store.returnScope(scopeName))

    header.appendChild(titleWrapper)
    header.appendChild(returnBtn)

    const logsContainer = document.createElement('div')
    logsContainer.className = 'scs-logs-container'
    applyColWidths(logsContainer, cols)

    const colHeaders = createColumnHeaders(logsContainer, cols)

    const logsEl = document.createElement('div')
    logsEl.className = 'scs-logs'

    logsContainer.appendChild(colHeaders)
    logsContainer.appendChild(logsEl)

    panel.appendChild(header)
    panel.appendChild(logsContainer)

    renderLogs(logsEl, scopeName)

    const unsubStore = store.subscribe(() => renderLogs(logsEl, scopeName))
    const unsubLogs = logStore.subscribe(() => renderLogs(logsEl, scopeName))

        ; (panel as any)._cleanup = () => {
            unsubStore()
            unsubLogs()
        }

    return panel
}

function createHorizontalResizer(wrapper: HTMLElement): HTMLElement {
    const resizer = document.createElement('div')
    resizer.className = 'scs-h-resizer'

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault()
        const startX = e.clientX
        const leftPanel = resizer.previousElementSibling as HTMLElement
        const rightPanel = resizer.nextElementSibling as HTMLElement
        if (!leftPanel || !rightPanel) return

        const leftWidth = leftPanel.offsetWidth
        const rightWidth = rightPanel.offsetWidth

        function onMove(e: MouseEvent): void {
            const dx = e.clientX - startX
            const newLeftWidth = Math.max(150, leftWidth + dx)
            const newRightWidth = Math.max(150, rightWidth - dx)
            leftPanel.style.flex = `0 0 ${newLeftWidth}px`
            rightPanel.style.flex = `0 0 ${newRightWidth}px`
        }

        function onUp(): void {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
    })

    return resizer
}

function updatePanelSizes(wrapper: HTMLElement): void {
    const panels = wrapper.querySelectorAll('.scs-panel, .scs-beside-panel')
    const count = panels.length
    if (count === 0) return

    const percentage = 100 / count
    panels.forEach(p => {
        (p as HTMLElement).style.flex = `1 1 ${percentage}%`
    })
}

export function createPanel(target: Element): void {
    if (document.getElementById(HOST_ID)) return

    const host = document.createElement('div')
    host.id = HOST_ID
    host.style.cssText = 'all: initial; position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;'
    target.appendChild(host)

        ; (['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress', 'input', 'focus', 'blur'] as const).forEach(event => {
            host.addEventListener(event, (e: Event) => e.stopPropagation())
        })

    const shadow = host.attachShadow({ mode: 'open' })

    shadow.appendChild(createStyleElement())

    const container = document.createElement('div')
    container.className = 'scs-container'
    container.id = CONTAINER_ID

    const panelsWrapper = document.createElement('div')
    panelsWrapper.className = 'scs-panels-wrapper'

    const panel = document.createElement('div')
    panel.className = 'scs-panel scs-main-panel'
    panel.id = PANEL_ID

    const header = document.createElement('div')
    header.className = 'scs-header'

    const headerLeft = document.createElement('div')
    headerLeft.className = 'scs-header-left'

    const title = document.createElement('span')
    title.className = 'scs-title'
    title.textContent = 'scoped-console'

    const badgesExpanded = document.createElement('div')
    badgesExpanded.className = 'scs-badges-expanded'

    const badgesCollapsed = document.createElement('div')
    badgesCollapsed.className = 'scs-badges-collapsed'

    headerLeft.appendChild(title)
    headerLeft.appendChild(badgesExpanded)
    headerLeft.appendChild(badgesCollapsed)

    const toggleBtn = document.createElement('button')
    toggleBtn.className = 'scs-toggle-btn'
    toggleBtn.setAttribute('aria-label', 'Toggle panel')
    toggleBtn.textContent = '−'

    const author = document.createElement('a')
    author.className = 'scs-author'
    author.href = 'https://hello.bajzath.cloud'
    author.target = '_blank'
    author.rel = 'noopener noreferrer'

    const authorName = document.createElement('span')
    authorName.textContent = 'Jakub Bajzath'

    const delimiter = document.createElement('span')
    delimiter.className = 'scs-author-delimiter'
    delimiter.textContent = '·'

    const website = document.createElement('span')
    website.className = 'scs-author-website'
    website.textContent = 'hello.bajzath.cloud'

    author.appendChild(authorName)
    author.appendChild(delimiter)
    author.appendChild(website)

    header.appendChild(headerLeft)
    header.appendChild(author)
    header.appendChild(toggleBtn)

    const scopesWrapper = document.createElement('div')
    scopesWrapper.className = 'scs-section'

    const scopesLabel = document.createElement('span')
    scopesLabel.className = 'scs-section-label'
    scopesLabel.textContent = 'Scopes'

    const scopesEl = document.createElement('div')
    scopesEl.className = 'scs-scopes'

    scopesWrapper.appendChild(scopesLabel)
    scopesWrapper.appendChild(scopesEl)

    const levelsWrapper = document.createElement('div')
    levelsWrapper.className = 'scs-section'

    const levelsLabel = document.createElement('span')
    levelsLabel.className = 'scs-section-label'
    levelsLabel.textContent = 'Levels'

    const levelsEl = document.createElement('div')
    levelsEl.className = 'scs-levels'

    levelsWrapper.appendChild(levelsLabel)
    levelsWrapper.appendChild(levelsEl)

    const logsHeader = document.createElement('div')
    logsHeader.className = 'scs-logs-header'

    const logsTitle = document.createElement('span')
    logsTitle.className = 'scs-logs-title'
    logsTitle.textContent = 'Output'

    const clearBtn = document.createElement('button')
    clearBtn.className = 'scs-clear-btn'
    clearBtn.textContent = 'clear'
    clearBtn.addEventListener('click', () => logStore.clear())

    logsHeader.appendChild(logsTitle)
    logsHeader.appendChild(clearBtn)

    const cols = loadColWidths()

    const logsContainer = document.createElement('div')
    logsContainer.className = 'scs-logs-container'

    applyColWidths(logsContainer, cols)

    const colHeaders = createColumnHeaders(logsContainer, cols)

    const logsEl = document.createElement('div')
    logsEl.className = 'scs-logs'

    logsContainer.appendChild(colHeaders)
    logsContainer.appendChild(logsEl)

    panel.appendChild(scopesWrapper)
    panel.appendChild(levelsWrapper)
    panel.appendChild(logsHeader)
    panel.appendChild(logsContainer)

    panelsWrapper.appendChild(panel)
    container.appendChild(header)
    container.appendChild(panelsWrapper)
    shadow.appendChild(container)

    const savedHeight = loadHeight()
    if (savedHeight) {
        container.style.height = `${savedHeight}px`
    }

    function setCollapsed(collapsed: boolean): void {
        if (collapsed) {
            container.classList.add('scs-container--collapsed')
            host.style.left = 'auto'
            toggleBtn.textContent = '+'
        } else {
            container.classList.remove('scs-container--collapsed')
            host.style.left = '0'
            toggleBtn.textContent = '−'
        }
    }

    if (loadCollapsed()) {
        setCollapsed(true)
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        const collapsed = !container.classList.contains('scs-container--collapsed')
        setCollapsed(collapsed)
        saveCollapsed(collapsed)
    })

    makeResizable(container)

    renderScopes(scopesEl)
    renderLevels(levelsEl)
    renderLogs(logsEl)
    renderBadgesExpanded(badgesExpanded)
    renderBadgesCollapsed(badgesCollapsed)

    function syncBesidePanels(): void {
        const poppedScopes = store.getPoppedOutScopes()
        const existingPanels = panelsWrapper.querySelectorAll('.scs-beside-panel')
        const existingScopes = new Set<string>()

        existingPanels.forEach(p => {
            const scope = (p as HTMLElement).dataset.scope
            if (scope && !poppedScopes.includes(scope)) {
                const prev = p.previousElementSibling
                if (prev?.classList.contains('scs-h-resizer')) {
                    prev.remove()
                }
                ; (p as any)._cleanup?.()
                p.remove()
            } else if (scope) {
                existingScopes.add(scope)
            }
        })

        poppedScopes.forEach(scopeName => {
            if (!existingScopes.has(scopeName)) {
                const besidePanel = createBesidePanel(scopeName, cols)
                const resizer = createHorizontalResizer(panelsWrapper)
                panelsWrapper.appendChild(resizer)
                panelsWrapper.appendChild(besidePanel)
            }
        })

        updatePanelSizes(panelsWrapper)
    }

    syncBesidePanels()

    store.subscribe(() => {
        renderScopes(scopesEl)
        renderLevels(levelsEl)
        renderLogs(logsEl)
        renderBadgesExpanded(badgesExpanded)
        renderBadgesCollapsed(badgesCollapsed)
        syncBesidePanels()
    })

    logStore.subscribe(() => {
        renderLogs(logsEl)
        renderBadgesExpanded(badgesExpanded)
        renderBadgesCollapsed(badgesCollapsed)
    })
}
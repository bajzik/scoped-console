export interface CallerLocation {
    file: string
    line: number | null
    column: number | null
}

export function getCallerLocation(): CallerLocation {
    const stack = new Error().stack
    if (!stack) return { file: 'unknown', line: null, column: null }

    const lines = stack.split('\n').map(l => l.trim())
    const callerLine = findCallerLine(lines)
    if (!callerLine) return { file: 'unknown', line: null, column: null }

    return extractLocation(callerLine)
}

function findCallerLine(lines: string[]): string | null {
    for (const line of lines) {
        if (!hasFileReference(line)) continue
        if (isInternalFrame(line)) continue
        return line
    }
    return null
}

function isInternalFrame(line: string): boolean {
    return (
        line.includes('node_modules') ||
        line.includes('scoped-console') ||
        line.includes('stackParser') ||
        line.includes('useLogger') ||
        line.includes('defineScope')
    )
}

function hasFileReference(line: string): boolean {
    return (
        line.includes('.vue') ||
        line.includes('.ts') ||
        line.includes('.js') ||
        line.includes('.tsx') ||
        line.includes('.jsx')
    )
}

function extractLocation(line: string): CallerLocation {
    // Match URL with optional line:column at the end (e.g., http://localhost:5173/src/file.vue:10:5)
    const urlMatch = line.match(/https?:\/\/[^\s)]+/)
    if (!urlMatch) {
        // Fallback for non-URL stack frames
        const fileMatch = line.match(/([^\s(]+\.(vue|ts|js|tsx|jsx)):(\d+):(\d+)/)
        if (fileMatch) {
            return {
                file: fileMatch[1].replace(/^.*\//, ''),
                line: parseInt(fileMatch[3], 10),
                column: parseInt(fileMatch[4], 10),
            }
        }
        return { file: 'unknown', line: null, column: null }
    }

    const fullUrl = urlMatch[0]
    // Extract line:column from end of URL (format: :line:column)
    const lineColMatch = fullUrl.match(/:(\d+):(\d+)$/)

    if (lineColMatch) {
        const urlWithoutLineCol = fullUrl.replace(/:(\d+):(\d+)$/, '')
        try {
            const url = new URL(urlWithoutLineCol)
            let path = url.pathname
            path = path.startsWith('/') ? path.slice(1) : path
            return {
                file: path || 'unknown',
                line: parseInt(lineColMatch[1], 10),
                column: parseInt(lineColMatch[2], 10),
            }
        } catch {
            return {
                file: 'unknown',
                line: parseInt(lineColMatch[1], 10),
                column: parseInt(lineColMatch[2], 10),
            }
        }
    }

    // No line:column found
    try {
        const url = new URL(fullUrl)
        let path = url.pathname
        path = path.startsWith('/') ? path.slice(1) : path
        return { file: path || 'unknown', line: null, column: null }
    } catch {
        return { file: 'unknown', line: null, column: null }
    }
}
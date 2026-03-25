export const PANEL_STYLES = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :host {
    all: initial;
    display: block;
  }

  .scs-container {
    position: relative;
    height: 280px;
    background: #1a1a1a;
    border-top: 1px solid #333;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #e0e0e0;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
    user-select: none;
    display: flex;
    flex-direction: column;
  }

  .scs-container--collapsed {
    width: auto !important;
    height: auto !important;
    left: auto !important;
    right: 0;
    bottom: 0;
    border: 1px solid #444;
    border-radius: 6px 0 0 0;
    box-shadow: -2px -2px 12px rgba(0, 0, 0, 0.4);
  }

  .scs-container--collapsed .scs-panels-wrapper {
    display: none;
  }

  .scs-panels-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .scs-panel {
    flex: 1;
    min-width: 200px;
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .scs-main-panel {
    flex: 1;
  }

  .scs-beside-panel {
    flex: 0 0 300px;
    min-width: 200px;
    background: #1a1a1a;
    border-left: 1px solid #333;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .scs-beside-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem;
    height: 32px;
    border-bottom: 1px solid #2a2a2a;
    flex-shrink: 0;
  }

  .scs-beside-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 11px;
  }

  .scs-return-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    line-height: 1;
    width: 20px;
    height: 20px;
  }

  .scs-return-btn:hover {
    color: #e0e0e0;
  }

  .scs-h-resizer {
    width: 4px;
    background: #333;
    cursor: col-resize;
    flex-shrink: 0;
  }

  .scs-h-resizer:hover {
    background: rgba(59, 130, 246, 0.6);
  }

  .scs-popout-btn {
    background: none;
    border: none;
    color: #444;
    cursor: pointer;
    font-size: 10px;
    padding: 0 4px;
    margin-left: 4px;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .scs-scope-tab:hover .scs-popout-btn {
    opacity: 1;
  }

  .scs-popout-btn:hover {
    color: #e0e0e0;
  }

  .scs-badges-collapsed {
    display: none;
  }

  .scs-container--collapsed .scs-badges-collapsed {
    display: flex;
  }

  .scs-container--collapsed .scs-badges-expanded {
    display: none;
  }

  .scs-container--collapsed .scs-resize-handle {
    display: none;
  }

  .scs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem;
    height: 32px;
    border-bottom: 1px solid #2a2a2a;
    flex-shrink: 0;
    gap: 0.5rem;
  }

  .scs-header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .scs-title {
    font-weight: bold;
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .scs-badges-expanded {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .scs-badges-collapsed {
    align-items: center;
    gap: 0.25rem;
  }

  .scs-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: bold;
    padding: 1px 5px;
    border-radius: 3px;
    line-height: 1.4;
  }

  .scs-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .scs-badge--log   { background: #2a2a2a; color: #888; }
  .scs-badge--info  { background: #1a2a3a; color: #3b82f6; }
  .scs-badge--warn  { background: #2a2200; color: #f59e0b; }
  .scs-badge--error { background: #2a0000; color: #ef4444; }
  .scs-badge--debug { background: #1a0a2a; color: #a855f7; }

  .scs-badge-dot--log   { background: #555; }
  .scs-badge-dot--info  { background: #3b82f6; }
  .scs-badge-dot--warn  { background: #f59e0b; }
  .scs-badge-dot--error { background: #ef4444; }
  .scs-badge-dot--debug { background: #a855f7; }

  .scs-toggle-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 13px;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .scs-toggle-btn:hover {
    color: #e0e0e0;
  }

  .scs-section {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #2a2a2a;
    flex-shrink: 0;
  }

  .scs-section-label {
    font-size: 10px;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0 0.75rem;
    white-space: nowrap;
    border-right: 1px solid #2a2a2a;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .scs-scopes {
    display: flex;
    align-items: center;
    overflow-x: auto;
    flex: 1;
  }

  .scs-scope-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0 0.75rem;
    height: 30px;
    cursor: pointer;
    font-size: 11px;
    color: #555;
    border-right: 1px solid #2a2a2a;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color 0.1s;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .scs-scope-tab:hover {
    color: #aaa;
    background: #222;
  }

  .scs-scope-tab--active {
    color: #e0e0e0;
    background: #111;
  }

  .scs-scope-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #444;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .scs-levels {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.75rem;
    flex: 1;
    height: 30px;
  }

  .scs-level-btn {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    border-radius: 3px;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 10px;
    font-weight: bold;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    opacity: 0.35;
    transition: opacity 0.1s;
    background: none;
  }

  .scs-level-btn--active {
    opacity: 1;
    border-color: currentColor;
  }

  .scs-level-btn--log   { color: #888; }
  .scs-level-btn--info  { color: #3b82f6; }
  .scs-level-btn--warn  { color: #f59e0b; }
  .scs-level-btn--error { color: #ef4444; }
  .scs-level-btn--debug { color: #a855f7; }

  .scs-logs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem;
    height: 26px;
    flex-shrink: 0;
    border-bottom: 1px solid #2a2a2a;
  }

  .scs-logs-title {
    font-size: 10px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .scs-clear-btn {
    background: none;
    border: none;
    color: #444;
    cursor: pointer;
    font-size: 10px;
    font-family: monospace;
    padding: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .scs-clear-btn:hover {
    color: #aaa;
  }

  .scs-logs-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .scs-logs-columns {
    display: grid;
    grid-template-columns: var(--col-time, 58px) var(--col-level, 42px) var(--col-scope, 90px) var(--col-file, 140px) 1fr;
    border-bottom: 1px solid #2a2a2a;
    flex-shrink: 0;
  }

  .scs-col-header {
    font-size: 9px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.75rem;
    position: relative;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    border-right: 1px solid #2a2a2a;
    background: #141414;
  }

  .scs-col-resizer {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 5px;
    cursor: col-resize;
    z-index: 2;
    background: transparent;
  }

  .scs-col-resizer:hover,
  .scs-col-resizer:active {
    background: rgba(59, 130, 246, 0.6);
  }

  .scs-logs {
    overflow-y: auto;
    flex: 1;
    user-select: text;
  }

  .scs-log-entry {
    display: grid;
    grid-template-columns: var(--col-time, 58px) var(--col-level, 42px) var(--col-scope, 90px) var(--col-file, 140px) 1fr;
    gap: 0;
    padding: 0.15rem 0.75rem;
    line-height: 1.5;
    border-bottom: 1px solid #1f1f1f;
    border-left: 2px solid transparent;
  }

  .scs-log-entry:hover {
    background: #1f1f1f;
  }

  .scs-log-time {
    color: #444;
    font-size: 10px;
    padding-top: 1px;
  }

  .scs-log-level {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    padding-top: 1px;
  }

  .scs-log-level--log   { color: #555; }
  .scs-log-level--info  { color: #3b82f6; }
  .scs-log-level--warn  { color: #f59e0b; }
  .scs-log-level--error { color: #ef4444; }
  .scs-log-level--debug { color: #a855f7; }

  .scs-log-scope {
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 1px;
    font-weight: bold;
  }

  .scs-log-file {
    font-size: 10px;
    color: #3d5a6a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 1px;
  }

  .scs-log-message {
    color: #ccc;
    font-size: 11px;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .scs-no-scope {
    padding: 0 0.75rem;
    color: #555;
    font-size: 11px;
  }

  .scs-resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: n-resize;
    z-index: 10;
  }

  .scs-resize-handle:hover {
    background: rgba(59, 130, 246, 0.3);
  }

  .scs-author {
    font-size: 11px;
    color: #888;
    white-space: nowrap;
    letter-spacing: 0.05em;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
  }

  .scs-author:hover .scs-author-website {
    color: #e0e0e0;
  }

  .scs-author-delimiter {
    color: #333;
    margin: 0 0.4rem;
  }

  .scs-author-website {
    color: #555;
    font-weight: normal;
    text-transform: none;
    letter-spacing: 0;
    transition: color 0.1s;
  }

  .scs-panel--collapsed .scs-author {
    display: none;
  }

  .scs-val-null,
  .scs-val-undefined {
    color: #808080;
  }

  .scs-val-string {
    color: #ce9178;
  }

  .scs-val-text {
    color: #ccc;
  }

  .scs-val-number {
    color: #b5cea8;
  }

  .scs-val-boolean {
    color: #569cd6;
  }

  .scs-collapsible {
    display: inline;
  }

  .scs-toggle {
    cursor: pointer;
    color: #888;
    font-size: 8px;
    margin-right: 4px;
    user-select: none;
    display: inline-block;
    width: 10px;
  }

  .scs-toggle:hover {
    color: #ccc;
  }

  .scs-preview {
    color: #9cdcfe;
  }

  .scs-tree-content {
    margin-left: 16px;
    border-left: 1px solid #333;
    padding-left: 8px;
  }

  .scs-tree-row {
    line-height: 1.4;
  }

  .scs-key-prop {
    color: #9cdcfe;
  }

  .scs-key-index {
    color: #b5cea8;
  }

  .scs-args {
    display: inline;
  }
`
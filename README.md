# @bajzik/scoped-console

[![npm version](https://img.shields.io/npm/v/@bajzik/scoped-console)](https://www.npmjs.com/package/@bajzik/scoped-console)
[![TypeScript](https://img.shields.io/badge/TypeScript-yes-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![npm downloads](https://img.shields.io/npm/dm/@bajzik/scoped-console)](https://www.npmjs.com/package/@bajzik/scoped-console)
[![license](https://img.shields.io/npm/l/@bajzik/scoped-console)](https://github.com/bajzik/scoped-console/blob/master/LICENSE)

[![CI](https://github.com/bajzik/scoped-console/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/bajzik/scoped-console/actions/workflows/ci.yml)
[![issues](https://img.shields.io/github/issues/bajzik/scoped-console)](https://github.com/bajzik/scoped-console/issues)


[![Socket Badge](https://badge.socket.dev/npm/package/@bajzik/scoped-console)](https://badge.socket.dev/npm/package/@bajzik/scoped-console)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@bajzik/scoped-console)](https://bundlephobia.com/package/@bajzik/scoped-console)

Tag your logs with scopes, filter them in real time, and watch them stream into a sleek in-page panel — without touching DevTools.

No dependencies. Framework agnostic. Zero cost in production.

![demo](https://hello.bajzath.cloud/images/scopedConsoleDemo052.gif)

---

## Installation

```bash
npm install @bajzik/scoped-console
# or
pnpm add @bajzik/scoped-console
```

---

## Usage

Init once in your entry point:

```ts
import { initConsole } from '@bajzik/scoped-console'
initConsole()
```

Then create a logger per file:

```ts
import { useLogger } from '@bajzik/scoped-console'

const logger = useLogger('UserProfile')

logger.log('mounted')
logger.info('fetching user', id)
logger.warn('slow response')
logger.error('request failed', err)
logger.debug('raw payload', data)
```

Logs appear in both DevTools and the in-page panel, tagged with the scope name.

---

## Vue 2

```js
// main.js
import { initConsole } from '@bajzik/scoped-console'
initConsole()

new Vue({ render: h => h(App) }).$mount('#app')
```

```js
// OrderView.vue
import { useLogger } from '@bajzik/scoped-console'
const logger = useLogger('OrderView')

export default {
  mounted() { logger.log('mounted') },
  methods: {
    async fetchOrder(id) {
      logger.info('fetching', id)
      try {
        const order = await this.$http.get(`/orders/${id}`)
        logger.log('loaded', order)
      } catch (err) {
        logger.error('failed', err)
      }
    }
  }
}
```

---

## Vue 3

```ts
// main.ts
import { initConsole } from '@bajzik/scoped-console'
initConsole()
createApp(App).mount('#app')
```

```ts
// UserProfile.vue
import { useLogger } from '@bajzik/scoped-console'
const logger = useLogger('UserProfile')

async function fetchUser(id: string) {
  logger.info('fetching', id)
  try {
    await userStore.fetch(id)
    logger.log('done')
  } catch (err) {
    logger.error('failed', err)
  }
}
```

---

## The panel

The panel renders at the bottom of the page, full width. It has three sections:

- **Scopes** — every file that called `useLogger` appears as a tab. Click to toggle.
- **Levels** — filter by `log`, `info`, `warn`, `error`, `debug`.
- **Output** — scrollable log stream. Text is selectable for copying.

The collapsed state shows a small tab in the bottom-right corner with badge counts per level. All state persists to `localStorage`.

---

## Production builds

In production builds the library is automatically replaced with no-ops — `initConsole` and `useLogger` do nothing and add zero bytes to your bundle. This works automatically in Vite, webpack 5, Rollup, and esbuild via package export conditions. No config needed.

For best results, add the package to `devDependencies`:

```bash
npm install --save-dev @bajzik/scoped-console
```

---

## Scope naming

```ts
useLogger('component:UserProfile')
useLogger('store:cart')
useLogger('service:api')
```

---

## API

`initConsole(config?)` — initialize. Call before anything else. `config.mount` defaults to `'body'`.

`useLogger(scope)` — returns a scoped logger with `log`, `info`, `warn`, `error`, `debug` methods.

`destroyConsole()` — restore original console and remove the panel.

---

## TypeScript — older moduleResolution

If your project uses `moduleResolution: node`, add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@bajzik/scoped-console": ["node_modules/@bajzik/scoped-console/dist/development/index.d.ts"]
    }
  }
}
```

---

## Changelog

### 1.0.0

- **First stable release**
- Collapsed panel now right-aligned instead of full width
- Collapsed panel hides resize handle
- Badge counts now include logs from popped-out scope panels
- Event isolation — clicks inside console panel no longer trigger host app event listeners
- Removed duplicate type definitions — consolidated `LogLevel` and `ScopedLogger` types
- Removed unused `getCallerFile` function from stack parser
- Removed all code comments for cleaner codebase
- Added comprehensive test coverage (76 tests)
- Added npm repository metadata

### 0.5.2

- Improved stack trace parsing — removed `<anonymous>` from internal frame filtering for more accurate source location detection

### 0.5.1

- Encapsulated panel UI in shadow DOM to prevent style conflicts with host application

### 0.5.0

- Added line and column tracking to log entries — each log now shows the exact source line and column where it was called
- Enhanced object/array visualization with DevTools-like syntax highlighting — objects and arrays are displayed with colored keys, strings, numbers, and booleans for better readability

### 0.4.0

- Added file column to log output — shows the source file path where `useLogger` was called, detected automatically via stack trace parsing
- Added scope colors — each scope gets a unique consistent color derived from its name, visible on scope tabs and log entries
- Added resizable columns — drag column dividers to resize time, level, scope and file columns, sizes persist to localStorage

### 0.3.0

- Production build stubs via package export conditions — zero bundle cost in production builds with no config required in Vite, webpack 5, Rollup, and esbuild

### 0.2.0

- Replaced `defineScope` with `useLogger` — returns a scoped logger object that re-asserts the scope before every call, fixing async timing issues in reactive frameworks

### 0.1.0

- Initial release — scoped console logging, in-page panel, scope and level filtering, persistent state via localStorage

---

## License

MIT © [Jakub Bajzath](https://hello.bajzath.cloud)
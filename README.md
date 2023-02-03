# Home-Assistant Vue SDK

The goal is to develop a VueJS SDK for Home-Assistant to enable easy development of custom dashboard for Home-Assistant that can be then ported to IOS and Android and used on tablets.

Communication with Home-Assistant is achieved through [their Websocket API](https://developers.home-assistant.io/docs/api/websocket/).

Have hopes to use CapacitorJS to port the SDK/dashboard to mobile platform.

> NOTE: Currently the project is a mess and doesn't really resemble an SDK, the plan is to first develop a working dashboard with support for all HA entity types and then extract the SDK part from it. While I don't think it's a good practice, it will make the development of project easier and thus faster in the early stages for me personally which is great as I don't really have a lot of free time for it.

Planned:

-   [ ] Auto-discovery of all types of HA entities
-   [ ] TypeScript types and classes
-   [ ] HA Service Calls hidden under-the-hood for communicating entity state update to HA
-   [ ] Make token acquirable via UI using HA OAuth
-   [ ] More stuff...

Problems:

-   [ ] Entity update not causing Vue DOM update (probably something to do with the way the Pinia store was implemented in this case)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

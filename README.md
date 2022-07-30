<div align="center">
    <br>
    <a href="https://github.com/distype/distype"><img src="https://raw.githubusercontent.com/distype/assets/master/banner.png" width="600"></a>
    <br><br>
    <p>
        <a href="https://www.npmjs.com/package/distype"><img src="https://img.shields.io/npm/v/distype.svg?color=5162F&style=for-the-badge&logo=npm"></a>
        <a href="https://github.com/distype/distype/actions/workflows/build.yml"><img src="https://img.shields.io/github/workflow/status/distype/distype/Build?style=for-the-badge&logo=github"><a>
        <a href="https://github.com/distype/distype/actions/workflows/tests.yml"><img src="https://img.shields.io/github/workflow/status/distype/distype/Tests?label=tests&style=for-the-badge&logo=github"><a>
        <a href="https://discord.gg/E2JsYPPJYN"><img src="https://img.shields.io/discord/773939670505619486?color=5162F1&style=for-the-badge&logo=discord&logoColor=white"></a>
    </p>
</div>

## About

A Discord library written in TypeScript for developers looking to interface directly with the [Discord API](https://discord.com/developers/docs/intro) with little to no abstractions.

### Features

- **Lightweight:** Distype uses minimal dependencies, and is highly performant due to the absence of transforming raw data from Discord into complex structures and abstractions.
- **Fully Featured:** Distype covers 100% of the Discord API, meaning that you'll never be missing out on any features.
- **Scalable:** With a built-in sharding manager (that supports big bot sharding) and a focus on performance, Distype makes it easy to scale your bot.
- **Predictable:** Distype is as close as you can get to the Discord API, meaning that typically, what you see in Discord's documentation is also here.
- **Modular:** The gateway manager, rest manager, and cache manager can all be instantiated independently, allowing for super lightweight solutions.
- **Highly Configurable:** Distype aims to offer as much configuration as possible of its internals, such as fully controllable cache behavior, retry and rate limit behavior, custom rest and gateway base URLs for proxy solutions, access to low-level http and websocket options, and more.

### Links

- **[Docs](https://distype.br88c.dev/)**
- **[NPM](https://www.npmjs.com/package/distype)**
- **[GitHub](https://github.com/distype/distype)**

### Related Packages

- **[@distype/cmd](https://github.com/distype/cmd):** A command handler for Distype.
- **[@distype/lavalink](https://github.com/distype/lavalink):** A Lavalink wrapper with native bindings to Distype.

## Example Bot

```ts
import { Client } from 'distype';

const client = new Client(YOUR_BOT_TOKEN);

client.gateway.connect();
```

> Note that Discord API typings are for API version `10`, and are from [discord-api-types](https://www.npmjs.com/package/discord-api-types). While you can still specify different API versions to be used, it is not recommended.

## Installation

Distype can be installed via npm.
```sh
npm install distype
```

### Prerequisites

- **[Node.js >=16.13.0](https://nodejs.org/)**
- **[NPM >=8.1.0](https://www.npmjs.com/)**

### Optional packages

- **[bufferutil](https://www.npmjs.com/package/bufferutil/):** Improves ws performance.
- **[utf-8-validate](https://www.npmjs.com/package/utf-8-validate/):** Improves ws performance.

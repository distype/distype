<div align="center">
    <br>
    <a href="https://github.com/boogcord/boogcord"><img src="https://raw.githubusercontent.com/boogcord/assets/master/banner.png" width="600"></a>
    <br><br>
    <p>
        <a href="https://discord.gg/hRXKcUKGHB"><img src="https://img.shields.io/discord/564877383308541964?maxAge=1800&color=5162F1&style=for-the-badge&logo=discord&logoColor=white"></a>
        <a href="https://www.npmjs.com/package/boogcord"><img src="https://img.shields.io/npm/v/boogcord.svg?maxAge=1800&color=5162F&style=for-the-badge"></a>
    </p>
</div>

## About

***DISCLAIMER: BOOGCORD IS STILL A WORK IN PROGRESS.***
Not all features mentioned below are complete and implemented. This disclaimer will be removed when this statement is no longer true.

A light yet robust Discord library written in TypeScript, catered towards developers looking for a final, no compromises solution for creating Discord bots. boogcord aims to pass data straight from the [Discord API](https://discord.com/developers/docs/intro) to you; no bloated middleware, abstractions, etc.

### Pros
- **Scalable:** With a built-in sharding manager, and even support for using Node.js worker threads, boogcord makes it easy to scale your bot, from 10 servers to 10 thousand.
- **Predictable:** boogcord is as close as you can get to the Discord API, meaning that typically, what you see in Discord's documentation is also here.
- **Lightweight:** boogcord does minimal manipulation of incoming gateway events, responses to REST requests, etc. Additionally, boogcord only has 6 direct dependencies, which resolve out to 12 in total.
- **Fully Featured:** boogcord covers 100% of the Discord API, meaning that you'll never be missing out on any features.
- **Plugins:** boogcord has several pre-built plugins that can be optionally installed, including a robust and easy to use command handler, a lavalink client for music bots, and a UI for monitoring your deployments along with manipulating multiple instances of your bot to cater zero downtime via rolling restarts.

### Cons
- **Not beginner friendly:** boogcord doesn't aim to be easily understood by new developers; it looks to serve as the final destination for advanced Discord bot developers.

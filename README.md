# DisStat-npm
The official npm package for [DisStat](https://disstat.numselli.xyz)

You can find the public api and example responses on https://disstat.numselli.xyz/docs,
if you dont want to use an api wrapper.

## ⚠️ Warning: This package is still in development and may not work as expected.
DisStat itself is still in development too, so expect breaking changes while we're not fully released.

# Installation
```bash
npm i disstat-npm
```

# Usage
```js
const DisStat = require("disstat-npm")

/*
 * @param {string} apiKey - Your api key, found at https://disstat.numselli.xyz/me
 * @param {string} bot - Your bot's user id OR your discord.js client. If provided, the package will automatically post server and user count to DisStat and as such, will disable related manual posting.
 */
const disstat = new DisStat("DS-apikey123", "685166801394335819")
const disstat = new DisStat("DS-apikey123", client)

/*
 * Gets data from your bot or someone else's (public) bot.
 * @param {string} botId? - The bot's id
 * @returns {Promise<Object>} - The bot's data
 */
const botData = await disstat.getBot()
console.log(botData)

/*
 * Posts your bots data to DisStat.
 * @param {Object} data - The data to post
 * @param {number} data.servers - The amount of servers your bot is in, e.g. client.guilds.cache.size
 * @param {number} data.users - The amount of users your bot can see, e.g. client.users.cache.size
 * @param {number} data.shards - The amount of shards your bot is using, e.g. client.shard.count
 * @param {boolean} returnStats? - Whether to return the stats after posting, default false
 * @returns {Promise<Object>} - The stats after posting, if returnStats is true
 */
const newBotData = await disstat.postData({ servers: 42, users: 100, shards: 1 }, true)
console.log(newBotData)

/*
 * Posts a command to DisStat.
 * @param {string} command - The command to post
 * @param {string} userId? - The user's id
 */
disstat.postCommand("help", "581146486646243339")

/*
 * Posts an event to DisStat.
 * @param {string} command - The command to post
 * @param {string} userId? - The user's id
 */
disstat.postEvent("interactionCreate", "581146486646243339")
```

# DisStat-npm
The official npm package for [DisStat](https://disstat.pages.dev) -
DisStat itself is [open source](https://github.com/DisStat/DisStat) btw!

You can find the public HTTP api docs on https://disstat.pages.dev/docs if you dont want to use an api wrapper.

# Installation
```bash
npm i disstat
```

# Main usage
```js
const DisStat = require("disstat")

/*
 * @param {string} apiKey - Your api key, found in your dashboard on https://disstat.pages.dev/me
 * @param {string|Discord.Client} bot - Your bot's user id OR a discord.js based bot client.
 *
 * If a client is provided, the package will automatically post server
 * and user count to DisStat ("autoposting").
 */
const disstat = new DisStat("DS-apikey123", "685166801394335819")
const disstat = new DisStat("DS-apikey123", client)

/*
 * Gets data from your bot or someone else public bot.
 * @param {string} botId? - The bot's id
 * @returns {Promise<Object>} - The bot's data
 */
const botData = await disstat.getBot()
console.log(botData)

/*
 * Posts your bots data to DisStat.
 * Warning: You shouldn't use this when autoposting.
 *
 * @param {Object} data - The data to post:
 * @param {number} data.servers - The amount of servers your bot is in, e.g. client.guilds.cache.size
 * @param {number} data.users - The amount of users your bot can see, e.g. client.users.cache.size
 * @param {number} data.shards - The amount of shards your bot is using, e.g. client.shard.count
 */
const newBotData = await disstat.postData({ servers: 42, users: 100, shards: 1 })
console.log(newBotData)

/*
 * Posts a command to DisStat using custom graphs.
 * Don't post user generated commands like custom commands to protect user privacy.
 * You also should exclude the prefix and command arguments from the command.
 *
 * @param {string} command - The command to post
 * @param {string} userId? - The user's id
 * @param {string} guildId? - The guild's id
 */
disstat.postCommand("info")
disstat.postCommand("help", "581146486646243339", "1081089799324180490")

/*
 * Posts data for a custom graph to DisStat.
 * Note that using a new type here creates the custom graph
 * on DisStat if you have enough unused graph slots.
 * Don't use names like "servers" or "users" here, as they are reserved
 * for the main graphs, and would get overwritten.
 *
 * @param {string} type - The name of the custom graph to post to
 * @param {string|Number} value1? - First custom value (e.g. an event name like "interactionCreate")
 * @param {string|Number} value2? - Second custom value (e.g. a user ID)
 * @param {string|Number} value3? - Third custom value (e.g. a guild ID)
 */
disstat.postCustom("events", "interactionCreate")

if (message.content.includes("<@" + bot.user.id + ">")) {
	disstat.postCustom("ping")
}
```

# Listening to events

```js
const DisStat = require("disstat")
const disstat = new DisStat(...)

disstat.on("post", (error, data) => {
	if (error) console.log("An error occurred while posting:", error, data)
	else console.log("Posted data successfully:", data)
	// This event also gets emitted on autoposting.
})

disstat.on("autopostStart", () => {
	console.log("Started autopost...")
})
disstat.on("autopostError", (error, data) => {
	console.log("Autopost failed: " + error, data)
})
disstat.on("autopostSuccess", data => {
	console.log("Successfully posting data:", data)
})

```

const baseURL = "https://disstat.numselli.xyz/api"
let apiKey = ""

let unposted = {
    commands: [],
    events: []
}
let botId = ""
let bot = {}

class DisStat {
	constructor(apiKeyInput = "", botInput = "") {
		if (!apiKeyInput) throw new Error("No DisStat API key provided. You can find the API key on the Manage Bot page of your bot.")

		botId = typeof botInput == "object" ? botInput.user.id : botInput
		if (!botId) throw new Error("Missing or invalid bot ID provided.")
		apiKey = apiKeyInput

		if (typeof botInput == "object") {
			bot = botInput
			setTimeout(autopost, 30000)
		}
	}

	async getBot(botIdInput = "") {
		return await getBot(botIdInput)
	}

	async postData(data = {}, returnStats = false) {
		return await postData(data, returnStats)
	}

	async sync() {
		await sync()
	}

	async postCommand(command = "", userId = "") {
		await postCommand(command, userId)
	}

	async postEvent(event = "", userId = "") {
		await postEvent(event, userId)
	}
}

async function autopost() {
    const data = unposted
    if (bot) {
        data.guildCount = bot.guilds.cache.size
        data.shardCount = bot.shard ? bot.shard.count : 0
        data.userCount = bot.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0)
    }
    data.commandsRun = unposted.commands ? unposted.commands.length : 0
    data.eventsReceived = unposted.events ? unposted.events.length : 0
    data.ramUsage = process.memoryUsage().heapUsed / 1024 / 1024
    data.totalRam = process.memoryUsage().heapTotal / 1024 / 1024
    data.cpuUsage = process.cpuUsage().user / 1000 / 1000

    await postData(data)
    unposted = {}
    setTimeout(autopost, 60000)
}

async function getBot(botIdInput = "") {
    const response = await fetch(baseURL + "/bots/" + (botIdInput || botId), {
        headers: {
            Authorization: apiKey
        }
    })
    return await response.json()
}

async function postData(data = {}, returnStats = false) {
    const response = await fetch(baseURL + "/stats/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: apiKey
        },
        body: JSON.stringify({
            ...data,
            id: botId
        })
    })
    if (returnStats) return await response.json()
}

async function sync() {
    await fetch(baseURL + "/bots/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: apiKey
        },
        body: JSON.stringify({
            bot: botId
        })
    })
}

async function postCommand(command = "", userId = "") {
    if (!command) throw new Error("No command provided.")
    const cmd = [command]
    if (userId) cmd.push(userId)
    unposted.commands.push(cmd)
}

async function postEvent(event = "", userId = "") {
    if (!event) throw new Error("No event provided.")
    const cmd = [event]
    if (userId) cmd.push(userId)
    unposted.events.push(cmd)
}

module.exports = DisStat

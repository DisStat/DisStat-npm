const baseURL = "https://disstat-api.tomatenkuchen.com/v1/"
const autopostInterval = 90000

const { EventEmitter } = require("node:events")
const os = require("node:os")

class DisStat extends EventEmitter {
	constructor(apiKeyInput = "", botInput = "") {
		super()

		this.apiKey = ""
		this.botId = ""
		this.bot = {}
		this.autoposting = false
		this.noManualWarningSent = false
		this.unpostedCustom = []

		if (!apiKeyInput) throw new TypeError("No DisStat API key provided as first argument. You can find the API key on the Manage Bot page of your bot.")
		if (!apiKeyInput.startsWith("DS-")) console.warn("[DisStat " + new Date().toLocaleTimeString() + "] The provided API key as first argument doesn't start with \"DS-\".")

		this.botId = typeof botInput == "object" ? botInput.user.id : botInput
		if (!this.botId) throw new TypeError("Missing (falsy) Discord bot ID provided, but a bot ID is required as second argument")
		this.apiKey = apiKeyInput

		if (typeof botInput == "object") {
			this.startUsage = process.cpuUsage()
			this.startTime = Date.now()
			this.prevUsage = {}

			this.autoposting = true
			this.bot = botInput
			setTimeout(() => this.autopost(), 30000)
		}

		this.emit("ready")
	}

	async autopost() {
		this.emit("autopostStart")

		const data = {
			custom: this.unpostedCustom
		}
		if (this.bot) {
			data.guildCount = this.bot.guilds.cache.size
			data.shardCount = this.bot.shard ? this.bot.shard.count : 0
			data.userCount = this.bot.guilds.cache.filter(guild => guild.available).reduce((acc, cur) => acc + cur.memberCount, 0)
			data.apiPing = this.bot.ws.ping
		}
		data.ramUsage = process.memoryUsage.rss()
		data.ramTotal = process.memoryUsage().heapTotal

		const endUsage = process.cpuUsage()
		const elapTime = endUsage.user - this.startUsage.user + endUsage.system - this.startUsage.system
		const elapTimeMS = Date.now() - this.startTime
		this.startUsage = process.cpuUsage()
		this.startTime = Date.now()
		data.cpu = 100 * elapTime / (1000 * elapTimeMS * os.cpus().length)

		// TODO: Bandwidth usage

		this.noManualWarningSent = true
		let result = {}
		try {
			result = await this.postData(data)
		} catch (e) {
			this.emit("autopostError", e, data)
			console.warn("[DisStat " + new Date().toLocaleTimeString() + "] Failed to post data to DisStat API. Error: " + e.message, result)

			setTimeout(() => this.autopost(), autopostInterval)
			return
		}

		setTimeout(() => this.autopost(), autopostInterval)
		this.unpostedCustom = []

		this.emit("autopostSuccess", data)
	}

	async getBot(botIdInput = "") {
		const response = await fetch(baseURL + "bot/" + (botIdInput || this.botId), {
			headers: {
				Authorization: this.apiKey,
				Accept: "application/json"
			}
		})
		return await response.json()
	}

	async postData(data = {}) {
		if (this.autoposting && !this.noManualWarningSent) {
			console.warn("[DisStat " + new Date().toLocaleTimeString() +
				"] You are using autoposting, but you are still manually posting data. This is not recommended, as it can cause duplication and data loss due to overwriting.")
			this.noManualWarningSent = true
		}

		if (!data || typeof data != "object" || Object.keys(data).length == 0) throw new TypeError("No data object provided to postData().")

		const response = await fetch(baseURL + "bot/" + this.botId, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: this.apiKey
			},
			body: JSON.stringify(data)
		}).catch(e => {
			this.emit("post", false)
			return e
		})

		if (response.status == 204) this.emit("post", true)
		else {
			const json = await response.json()
			this.emit("post", response.ok, json)
			return json
		}
	}

	async postCommand(command = "", userId = void 0, guildId = void 0) {
		if (!command || command.trim() == "") return new TypeError("No command name provided to postCommand().")
		this.postCustom("command", command, userId, guildId)
	}

	async postCustom(type = "", value1 = void 0, value2 = void 0, value3 = void 0) {
		if (!type || type.trim() == "") return new TypeError("No custom graph type provided to postCustom().")

		const body = {
			type,
			value1,
			value2,
			value3
		}
		if (this.autoposting) this.unpostedCustom.push(body)
		else await fetch(baseURL + "bot/" + this.botId + "/custom", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.apiKey
			},
			body: JSON.stringify(body)
		})
	}
}

module.exports = DisStat

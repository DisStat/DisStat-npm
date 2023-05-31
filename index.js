class DisStat {
	constructor(apikey = "", bot = "") {
		if (!apikey) throw new Error("No API key for DisStat provided. You can find your API key in the DisStat dashboard, it's the same for all your bots.")

		this.botId = typeof bot == "object" ? bot.user.id : bot
		if (!this.botId) throw new Error("No or invalid bot ID provided.")
		this.apikey = apikey
		this.base_url = "https://disstat.numselli.xyz/api"

		if (typeof bot == "object") {
			this.bot = bot
			this.unposted = {}
			this.autopost()
		}
	}

	async autopost() {
		const data = this.unposted
		if (this.bot) {
			data.guildCount = this.bot.guilds.cache.size
			data.shardCount = this.bot.shard ? this.bot.shard.count : 0
			data.userCount = this.bot.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0)
		}
		data.commandsRun = this.unposted.commands ? this.unposted.commands.length : 0
		data.ramUsage = process.memoryUsage().heapUsed / 1024 / 1024
		data.totalRam = process.memoryUsage().heapTotal / 1024 / 1024
		data.cpuUsage = process.cpuUsage().user / 1000 / 1000

		await this.postData(data)
		this.unposted = {}
		setTimeout(autopost, 60000)
	}

	async getBot(botId = "") {
		const response = await fetch(this.base_url + "/bots/" + (botId || this.botId), {
			headers: {
				Authorization: this.apikey
			}
		})
		return await response.json()
	}

	async getMyBots() {
		const response = await fetch(this.base_url + "/mybots", {
			headers: {
				Authorization: this.apikey
			}
		})
		return await response.json()
	}

	async postData(data = {}, returnStats = false) {
		const response = await fetch(this.base_url + "/stats/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.apikey
			},
			body: JSON.stringify({
				...data,
				id: this.botId
			})
		})
		if (returnStats) return await response.json()
	}

	async sync() {
		await fetch(this.base_url + "/bots/sync", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.apikey
			},
			body: JSON.stringify({
				bot: botId
			})
		})
	}

	async postCommand(command = "", userId = "") {
		if (!command) throw new Error("No command provided.")

		await fetch(this.base_url + "/bot/" + this.botId + "/cmd", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.apikey
			},
			body: JSON.stringify({
				command,
				userId
			})
		})
	}

	async postEvent(event = "", userId = "") {
		if (!event) throw new Error("No event provided.")
		fetch(this.base_url + "/bot/" + this.botId + "/event", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.apikey
			},
			body: JSON.stringify({
				event,
				userId
			})
		})
	}
}

module.exports = DisStat

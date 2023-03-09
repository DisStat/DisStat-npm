class ApiWrapper {
	constructor(apikey = "", botId = "") {
		if (!apikey) throw new Error("No API key for DisStat provided. You can find your API key in the DisStat dashboard, it's the same for all your bots.")
		if (!botId) throw new Error("No bot ID provided.")

		this.apikey = apikey
		this.botId = botId
		this.base_url = "https://apids.tomatenkuchen.eu"
	}

	async getBot(botId = "") {
		const url = this.base_url + "/bot/" + (botId || this.botId)
		const response = await fetch(url, {
			headers: {
				Authorization: this.apikey
			}
		})
		return await response.json()
	}

	async postData(data = {}, returnStats = false) {
		const url = this.base_url + "/bot/" + this.botId
		const response = await fetch(url, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: this.apikey
			},
			body: JSON.stringify(data)
		})
		if (returnStats) return await response.json()
	}

	async postCommand(command = "", userId = "") {
		const url = this.base_url + "/bot/" + this.botId + "/cmd"
		fetch(url, {
			method: "post",
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
	async postCmd(command = "", userId = "") {
		return await this.postCommand(command, userId)
	}

	async postEvent(event = "", userId = "") {
		const url = this.base_url + "/bot/" + this.botId + "/event"
		fetch(url, {
			method: "post",
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

const DisStat = require("./index.js")

test("missing apikey", () => {
	expect(() => new DisStat()).toThrow()
})
test("missing botId", () => {
	expect(() => new DisStat("jest")).toThrow()
})

test("getBot", async () => {
	const disstat = new DisStat("jest", "jest")
	const bot = await disstat.getBot("685166801394335819")
	expect(Object.keys(bot)).toContain("id")
	expect(Object.keys(bot)).toContain("name")
})

test("postData", async () => {
	const disstat = new DisStat("jest", "jest")
	const data = await disstat.postData({}, true)
	expect(Object.keys(data)).toContain("message")
})

test("postCommand", async () => {
	const disstat = new DisStat("jest", "jest")
	const data = await disstat.postCommand("jest")
	expect(data).toBeUndefined()
})

// This test fails as it should, but it crashes the whole test process with it.
/*test("postCmd without command", () => {
	const disstat = new DisStat("jest", "jest")
	expect(async () => {
		await disstat.postCmd()
	}).toThrow("no command provided")
})*/

test("postEvent", async () => {
	const disstat = new DisStat("jest", "jest")
	const data = await disstat.postEvent("jest", "jest")
	expect(data).toBeUndefined()
})

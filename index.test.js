const DisStat = require("./index.js")

test("missing apikey", () => {
	expect(() => new DisStat()).toBeInstanceOf(Function)
})
test("missing botId", () => {
	expect(() => new DisStat("jest")).toBeInstanceOf(Function)
})

test("getBot", async () => {
	const disstat = new DisStat("jest", "jest")
	const bot = await disstat.getBot("685166801394335819")
	expect(Object.keys(bot)).toContain("username")
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

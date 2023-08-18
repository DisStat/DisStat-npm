const DisStat = require("./index.js")

test("missing apikey", () => {
	expect(new DisStat()).toBeInstanceOf(Error)
})
test("missing botId", () => {
	expect(new DisStat("jest")).toBeInstanceOf(Error)
})

test("getBot", async () => {
	const disstat = new DisStat("jest", "jest")
	const bot = await disstat.getBot("685166801394335819")
	expect(Object.keys(bot)).toContain("username")
})

/*test("postData", async () => {
	const disstat = new DisStat("jest", "jest")
	const data = await disstat.postData({}, true)
	expect(Object.keys(data)).toContain("message")
})*/

test("postCommand empty", async () => {
	const disstat = new DisStat("jest", "jest")
	const data = await disstat.postCommand()
	expect(data).toBeInstanceOf(Error)
})

test("postCommand with content", async () => {
	const disstat = new DisStat("jest", "jest")
	const data = await disstat.postCommand("jest")
	expect(data).toBeUndefined()
})

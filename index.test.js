const DisStat = require("./index.js")

test("missing apikey", () => {
	expect(() => new DisStat()).toThrow(TypeError)
})
test("missing botId", () => {
	expect(() => new DisStat("DS-jest")).toThrow(TypeError)
})

test("getBot", async () => {
	const disstat = new DisStat("DS-jest", "jest")
	const bot = await disstat.getBot("685166801394335819")
	expect(Object.keys(bot)).toContain("username")
})

test("getBot non-public without api key", async () => {
	const disstat = new DisStat("DS-jest", "jest")
	const bot = await disstat.getBot("1015335483112431778")
	expect(Object.keys(bot)).toContain("message")
})
test("getBot non-public with api key", async () => {
	const disstat = new DisStat("DS-JEST-esWa3aPpL0L27m", "jest")
	const bot = await disstat.getBot("1015335483112431778")
	expect(Object.keys(bot)).toContain("username")
})

test("postData with invalid api key", async () => {
	const disstat = new DisStat("DS-jest", "1015335483112431778")
	const data = await disstat.postData({guilds: 1})
	expect(Object.keys(data)).toContain("message")
})
test("postData with valid api key", async () => {
	const disstat = new DisStat("DS-JEST-esWa3aPpL0L27m", "1015335483112431778")
	expect(await disstat.postData({guilds: 1})).toBeUndefined()
})

test("postCommand empty", async () => {
	const disstat = new DisStat("DS-jest", "jest")
	const data = await disstat.postCommand()
	expect(data).toBeInstanceOf(TypeError)
})

test("postCommand with content", async () => {
	const disstat = new DisStat("DS-jest", "jest")
	const data = await disstat.postCommand("jest")
	expect(data).toBeUndefined()
})

test("postCustom empty", async () => {
	const disstat = new DisStat("DS-jest", "jest")
	const data = await disstat.postCustom()
	expect(data).toBeInstanceOf(TypeError)
})

test("postCustom with all four args", async () => {
	const disstat = new DisStat("DS-jest", "jest")
	const data = await disstat.postCustom("jest", "jest", "jest", "jest")
	expect(data).toBeUndefined()
})

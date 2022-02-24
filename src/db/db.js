const { MongoClient } = require("mongodb");
require("dotenv").config();

async function hasSession(url, id) {
	const client = new MongoClient(url);

	try {
		await client.connect();

		const db = client.db(process.env.DB_NAME);
		const session = db.collection(process.env.DB_COLLECTION);

		const res = await session.findOne(
			{ _id: id },
			{
				projection: { _id: 1, session: 0, expires: 0 },
			}
		);

		return res === null ? false : true;
	} catch {
		console.error;
	} finally {
		await client.close();
	}
}

module.exports = {
	hasSession,
};

import { MongoClient } from "mongodb";

class MongoDatabase {
	public client: MongoClient | null | undefined;

	constructor() {
		this.client = null;
	}

	public async connect() {
		if (this.client != null && !this.client.isConnected()) {
			this.client = null;
		}
		if (this.client == null) {
			const uri = process.env.MONGO_URI;
			if (uri == null) {
				throw new Error("MONGO_URI");
			}
			this.client = await MongoClient.connect(uri);
		}
		return this.client;
	}
}

export default new MongoDatabase();
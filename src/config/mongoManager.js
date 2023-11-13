import mongoose from "mongoose";
import CONFIG from "./config.js";
import { infoLogger } from "../utils/logger.js";

export class MongoManager {
	static #instance;
	constructor() {
		// Set up database connection
		mongoose.set("strictQuery", false);
		mongoose
			.connect(CONFIG.mongo.URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				infoLogger("MongoDB connected");
			})
			.catch((error) => {
				infoLogger("Error connecting to MongoDB:" + error);
			});
	}

	static start() {
		if (!this.#instance) {
			this.#instance = new MongoManager();
		}
		return this.#instance;
	}
}

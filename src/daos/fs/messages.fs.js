import fs from "fs";

export default class Messages {
	constructor(path) {
		this.path = path;
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, "[]");
		}
	}

	async getUserMessages(user) {
		try {
			const data = await fs.promises.readFile(this.path, "utf-8");
			const messages = JSON.parse(data);

			if (messages[user]) {
				return messages[user];
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async saveUser(user) {
		try {
			const data = await fs.promises.readFile(this.path, "utf-8");
			const messages = JSON.parse(data);

			if (!messages[user]) {
				messages[user] = [];
				await fs.promises.writeFile(
					this.path,
					JSON.stringify(messages, null, 2)
				);
			}

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async saveUserMessage(user, message) {
		try {
			const data = await fs.promises.readFile(this.path, "utf-8");
			const messages = JSON.parse(data);

			if (!messages[user]) {
				messages[user] = [];
			}

			messages[user].push(message);

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(messages, null, 2)
			);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}

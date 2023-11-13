import { messageModel } from "../../models/schemas/messages.schema.js";

export default class Messages {
	async get(user) {
		let userMessages;
		try {
			userMessages = await messageModel.findOne(
				{ user: user },
				{ message: 1, _id: 0 }
			);

			userMessages = userMessages ? userMessages.message : [];
		} catch (error) {
			console.log(error);
			userMessages = false;
		}
		return userMessages;
	}

	async save(user) {
		let result;
		try {
			result = await messageModel.create({ user: user });
		} catch (error) {
			result = false;
		}
		return result;
	}

	async saveMessage(user, message) {
		let result;
		let userMessages = await this.get(user);
		userMessages.push(message);
		result = await messageModel.findOneAndUpdate(
			{ user: user },
			{ message: userMessages }
		);
		return result;
	}
}

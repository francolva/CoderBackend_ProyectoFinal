export default class MessageRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getMessages(user) {
		try {
			return await this.dao.get(user);
		} catch (error) {
			throw new Error(error);
		}
	}

    async saveUser(user) {
        try {
            return await this.dao.save(user);
        } catch (error) {
            throw new Error(error);
        }
    }

    async saveUserMessage(user, message) {
        try {
            return await this.dao.saveMessage(user, message);
        } catch (error) {
            throw new Error(error);
        }
    }
}

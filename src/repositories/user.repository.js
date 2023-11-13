import { generateToken } from "../utils/utils.js";

export default class UsersRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async findAllUsers() {
		return await this.dao.getAll({ role: { $ne: "admin" } });
	}

	async findUserByEmail(email) {
		return await this.dao.get({ email: email });
	}

	async findUserByID(userID) {
		return await this.dao.get({ _id: userID });
	}

	async findInactiveUsers(twoDaysAgo) {
		return await this.dao.getAll({
			lastLogin: { $lt: twoDaysAgo },
		});
	}

	async createUser(user) {
		return await this.dao.create(user);
	}

	async updateCartInUser(email, cart) {
		const user = await this.dao.get({ email: email });
		if (!user.cart) {
			return await this.dao.updateCart(email, cart);
		}
	}

	async updateUser(email, payload) {
		try {
			return await this.dao.update(email, payload);
		} catch (error) {
			throw new Error(error);
		}
	}

	async updateUserByID(userID, payload) {
		try {
			return await this.dao.updateByID(userID, payload);
		} catch (error) {
			throw new Error(error);
		}
	}

	async generatePasswordToken() {
		const token = generateToken();
		return token;
	}

	async deleteUser(user) {
		try {
			return await this.dao.delete(user);
		} catch (error) {
			throw new Error(error);
		}
	}
}

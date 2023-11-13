import userModel from "../../models/schemas/users.schema.js";

export default class Users {
	async get(query) {
		try {
			const user = await userModel.findOne(query);
			return user;
		} catch (error) {
			console.log("Cannot find user");
		}
	}

	async getAll(query) {
		try {
			const users = await userModel.find(query);
			return users;
		} catch (error) {
			console.log("Cannot find users");
		}
	}

	async create(newUser) {
		try {
			const user = await userModel.create(newUser);
			return user;
		} catch (error) {
			console.log(error, "Cannot create user");
		}
	}

	async update(email, updateRequest) {
		let user;
		try {
			user = await userModel.findOneAndUpdate(
				{ email: email },
				updateRequest
			);
		} catch (error) {
			user = false;
		}
		return user;
	}

	async updateByID(userID, updateRequest) {
		let user;
		try {
			user = await userModel.findByIdAndUpdate(userID, updateRequest);
		} catch (error) {
			user = false;
		}
		return user;
	}

	async updateCart(email, cart) {
		try {
			const user = await userModel.findOneAndUpdate(
				{ email: email },
				{ cart: cart }
			);
			return user;
		} catch (error) {
			console.log(error, "Cannot update user");
			return;
		}
	}

	async getPurchaser(cart) {
		try {
			const user = await userModel.findOne({ cart: cart });
			return user;
		} catch (error) {
			console.log("Cannot find user");
			return;
		}
	}

	async delete(user) {
		try {
			const deleted = await userModel.deleteOne({ email: user.email });
			return deleted;
		} catch (error) {
			console.log("Cannot delete user");
		}
	}
}

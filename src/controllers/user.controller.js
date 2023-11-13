import { UsersDTO } from "../dto/user.dto.js";
import { mailingService, userService, productService } from "../repositories/services.js";
import { deletedAccount } from "../services/mailing/mailingTemplates.js";

class UsersController {
	async getUsersInfo(req, res) {
		const users = await userService.findAllUsers();
		const usersDTO = users.map((user) => new UsersDTO(user));
		res.status(200).send({ data: usersDTO });
	}

	async changeOwnUserRole(req, res) {
		const userID = req.params.uid;
		const role = req.session.user.role;
		let user;
		switch (role) {
			case "admin":
				req.logger.warning("Cannot change admin rights");
				return res.status(403).send({
					error: "Forbidden",
					message: "Cannot change admin rights",
				});
			case "premium":
				user = await userService.updateUserByID(userID, {
					role: "user",
				});
				req.session.user.role = "user";
				req.logger.info("Updated user role to User");
				return res.status(200).send("Changed role to User");
			case "user":
				user = await userService.updateUserByID(userID, {
					role: "premium",
				});
				req.session.user.role = "premium";
				req.logger.info("Updated user role to Premium");
				return res.status(200).send("Changed role to Premium");
			default:
				req.logger.fatal("Cannot update user role");
				return res.status(500).send({
					error: "Unknown",
					message: "Unable to update user role",
				});
		}
	}

	async adminChangeUserRole(req, res) {
		const email = req.body.user.email;
		const role = req.body.user.role;
		let user;
		switch (role) {
			case "premium":
				user = await userService.updateUser(email, {
					role: "user",
				});
				req.logger.info("Updated user role to User");
				return res.status(200).send("Changed role to User");
			case "user":
				user = await userService.updateUser(email, {
					role: "premium",
				});
				req.logger.info("Updated user role to Premium");
				return res.status(200).send("Changed role to Premium");
			default:
				req.logger.fatal("Cannot update user role");
				return res.status(500).send({
					error: "Unknown",
					message: "Unable to update user role",
				});
		}
	}

	async adminDeleteUser(req, res) {
		const user = req.body.user;
		const deletedUser = await userService.deleteUser(user);
		const deletedUserProducts = await productService.deleteUserProducts(user);
		req.logger.info(`Deleted user ${deletedUser}`);
		return res.status(200).send("Deleted user");
	}

	async deleteInactiveUsers(req, res) {
		const twoDaysAgo = new Date();
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

		const inactiveUsers = await userService.findInactiveUsers(twoDaysAgo);
		inactiveUsers.forEach(async (user) => {
			const deletedUser = await userService.deleteUser(user);
			const deletedUserProducts =
				await productService.deleteUserProducts(user);
			req.logger.info(`Deleted inactive user ${deletedUser}`);
			const mailTemplate = deletedAccount();
			await mailingService.send({ to: user.email, ...mailTemplate });
		});
		return res.status(200).send("Deleted inactive users");
	}
}

export default UsersController;

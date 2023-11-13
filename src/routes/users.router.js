import { Router } from "express";
import UsersController from "../controllers/user.controller.js";
import { adminOnly } from "../middleware/authentication.js";

const usersController = new UsersController();

class UsersRouter {
	constructor() {
		this.router = Router();

		this.router.get("/", async (req, res) => {
			usersController.getUsersInfo(req, res);
		});

		this.router.get("/premium/:uid", async (req, res) => {
			usersController.changeOwnUserRole(req, res);
		});

		this.router.put("/changeuserrole", adminOnly, async (req, res) => {
			usersController.adminChangeUserRole(req, res);
		});

		this.router.delete("/deleteuser", adminOnly, async (req, res) => {
			usersController.adminDeleteUser(req, res);
		});

		this.router.delete("/", adminOnly, async (req, res) => {
			usersController.deleteInactiveUsers(req, res);
		});
	}

	getRouter() {
		return this.router;
	}
}

export default new UsersRouter();

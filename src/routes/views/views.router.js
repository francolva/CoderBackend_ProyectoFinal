import { Router } from "express";
import {
	usersOnly,
	isAuth,
	userRole,
	adminOnly,
} from "../../middleware/authentication.js";
import ViewsController from "../../controllers/views.controller.js";

const viewsController = new ViewsController();

class ViewsRouter {
	constructor() {
		this.router = Router();

		this.router.get("/home", isAuth, async (req, res) => {
			viewsController.renderHome(req, res);
		});

		this.router.get("/home/:pid", isAuth, async (req, res) => {
			viewsController.renderHomeProduct(req, res);
		});

		this.router.get("/realtimeproducts", isAuth, async (req, res) => {
			viewsController.renderRealTimeProducts(req, res);
		});

		this.router.get("/chat", isAuth, usersOnly, (req, res) => {
			viewsController.renderChat(req, res);
		});

		this.router.get("/products", isAuth, userRole, async (req, res) => {
			viewsController.renderProducts(req, res);
		});

		this.router.get("/carts/:cid", isAuth, async (req, res) => {
			viewsController.renderCart(req, res);
		});

		this.router.get("/ticket/:tid", isAuth, async (req, res) => {
			viewsController.renderTicket(req, res);
		});

		this.router.get("/register", (req, res) => {
			viewsController.renderRegister(req, res);
		});

		this.router.get("/login", (req, res) => {
			viewsController.renderLogin(req, res);
		});

		this.router.get("/forgotpassword", (req, res) => {
			viewsController.renderPasswordRecovery(req, res);
		});

		this.router.get("/reset/:token", (req, res) => {
			viewsController.renderPasswordChange(req, res);
		});

		this.router.get("/", isAuth, (req, res) => {
			viewsController.renderProfile(req, res);
		});

		this.router.get("/admin", isAuth, adminOnly, (req, res) => {
			viewsController.renderAdminDashboard(req, res);
		});
	}

	getRouter() {
		return this.router;
	}
}

export default new ViewsRouter();

import { Router } from "express";
import { isAuth } from "../middleware/authentication.js";
import SessionsController from "../controllers/sessions.controller.js";
import passport from "passport";

const sessionsController = new SessionsController();

class SessionRouter {
	constructor() {
		this.router = Router();

		// Set register endpoint with passport
		this.router.post(
			"/register",
			passport.authenticate("register", {
				failureRedirect: "/api/sessions/failregister",
			}),
			async (req, res) => {
				sessionsController.registerUser(req, res);
			}
		);
		this.router.get("/failregister", async (req, res) => {
			sessionsController.failRegister(req, res);
		});

		// Set login endpoint
		this.router.post(
			"/login",
			passport.authenticate("login", {
				failureRedirect: "/api/sessions/faillogin",
				failureMessage: true,
			}),
			async (req, res) => {
				sessionsController.loginUser(req, res);
			}
		);

		this.router.get("/faillogin", async (req, res) => {
			sessionsController.failLogin(req, res);
		});

		// Set logout endpoint
		this.router.post("/logout", (req, res) => {
			sessionsController.logoutUser(req, res);
		});

		// Set current user endpoint
		this.router.get("/current", isAuth, (req, res) => {
			sessionsController.getCurrentUser(req, res);
		});

		// Set password recovery endpoints
		this.router.post("/forgotpassword", (req, res) => {
			sessionsController.forgotPassword(req, res);
		});

		this.router.post("/reset", (req, res) => {
			sessionsController.resetPassword(req, res);
		});

		// Set Github login endpoint
		this.router.get(
			"/github",
			passport.authenticate("github", { scope: ["user:email"] }),
			async (req, res) => {}
		);

		this.router.get(
			"/githubcallback",
			passport.authenticate("github", {
				failureRedirect: "/login",
			}),
			async (req, res) => {
				sessionsController.githubCallback(req, res);
			}
		);
	}

	getRouter() {
		return this.router;
	}
}

export default new SessionRouter();

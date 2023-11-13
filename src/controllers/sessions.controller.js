import { CurrentUserDTO } from "../dto/user.dto.js";
import {
	cartService,
	mailingService,
	userService,
} from "../repositories/services.js";
import { passwordRecoveryTemplate } from "../services/mailing/mailingTemplates.js";
import { createHash, isValidPassword } from "../utils/utils.js";

class SessionsController {
	async registerUser(req, res) {
		res.send({ status: "success", message: "User Registered" });
	}

	async failRegister(req, res) {
		req.logger.error("User could not be registered");
		res.status(400).send({
			error: "failed",
			message: "User could not be registered",
		});
	}

	async loginUser(req, res) {
		req.session.user = req.user;
		if (!req.session.user.cart) {
			const newCart = await cartService.saveCart();
			const userEmail = req.session.user.email;
			const updatedUser = await userService.updateCartInUser(
				userEmail,
				newCart
			);
			req.session.user.cart = updatedUser.cart;
		}

		return res.send({ status: "sucess", payload: req.user });
	}

	async failLogin(req, res) {
		if (!req.user) {
			req.logger.warning("Cannot log user");
		}
		res.send({
			error: "failed",
			message: "Login failed, please try again later",
		});
	}

	async logoutUser(req, res) {
		req.session.destroy((err) => {
			if (!err) {
				return res.status(200).send("Logged out successfully");
			} else {
				req.logger.fatal("Cannot logout user");
				return res.status(500).send({ status: "error", body: err });
			}
		});
	}

	async getCurrentUser(req, res) {
		res.send(new CurrentUserDTO(req.user));
	}

	async githubCallback(req, res) {
		req.session.user = req.user;
		if (!req.session.user.cart) {
			const newCart = await cartService.saveCart();
			const userEmail = req.session.user.email;
			const updatedUser = await userService.updateCartInUser(
				userEmail,
				newCart
			);
			req.session.user.cart = updatedUser.cart;
		}
		return res.redirect("/");
	}

	async forgotPassword(req, res) {
		const baseURL = req.get("host");
		const email = req.body.email;
		let user = await userService.findUserByEmail(email);
		if (!user) {
			req.logger.warning("User not found");
			return res
				.status(404)
				.send({ error: "failed", message: "Cannot find user" });
		}

		const token = await userService.generatePasswordToken();
		const mailTemplate = passwordRecoveryTemplate(baseURL, token);
		await mailingService.send({ to: email, ...mailTemplate });
		res.cookie(
			"passwordResetToken",
			JSON.stringify({ user: email, resetToken: token }),
			{
				maxAge: 1000 * 60 * 60 * 1, // 1hr (ms/s * s/min * min/hr * hr)
				httpOnly: false,
			}
		).send("Cookie");
	}

	async resetPassword(req, res) {
		const password = req.body.password;
		const email = JSON.parse(req.cookies.passwordResetToken).user;
		const user = await userService.findUserByEmail(email);
		const isSamePassword = isValidPassword(user, password);
		if (isSamePassword) {
			req.logger.warning("Cannot use previous password");
			return res.status(403).send({
				error: "forbidden",
				message: "Cannot repeat passwords",
			});
		}
		try {
			await userService.updateUser(email, {
				password: createHash(password),
			});
			res.status(200).send("Success");
		} catch (error) {
			req.logger.fatal("Unknown error");
		}
	}
}

export default SessionsController;

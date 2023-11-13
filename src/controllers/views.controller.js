import {
	cartService,
	productService,
	ticketService,
	userService,
} from "../repositories/services.js";
import { UserDashboardDTO, UsersDTO } from "../dto/user.dto.js";

class ViewsController {
	// Render the home view
	async renderHome(req, res) {
		const user = req.session.user;
		const query = req.query;
		const paginatedProducts = await productService.getProducts(query);
		try {
			const { docs: products, ...paginationInfo } = paginatedProducts;
			res.render("home", { products, user });
		} catch (error) {
			req.logger.fatal("Unknown error");
			return res.status(500).send({
				status: "error",
				payload: {},
				message: "Unknown error",
			});
		}
	}

	// Render the home view filtering a specific product
	async renderHomeProduct(req, res) {
		const productID = req.params.pid;
		const product = await productService.getProductById(productID);
		if (!product) {
			req.logger.error("Product not found");
			return res
				.status(404)
				.send(`Cannot find product with ID: ${productID}`);
		}
		res.render("home", { product });
	}

	// Render real-time products with sockets view
	async renderRealTimeProducts(req, res) {
		const query = req.query;
		const paginatedProducts = await productService.getProducts(query);
		try {
			const user = req.session.user;
			const owner = user.role === "premium" ? user.email : "admin";
			const { docs: products, ...paginationInfo } = paginatedProducts;
			res.render("realTimeProducts", { products, owner, user });
		} catch (error) {
			req.logger.fatal("Unknown error");
			return res.status(500).send({
				status: "error",
				payload: {},
				message: "Unknown error",
			});
		}
	}

	// Render chat with sockets view
	async renderChat(req, res) {
		req.logger.info("A user connected");
		res.render("chat", { user: new UsersDTO(req.session.user) });
	}

	// Render products view
	async renderProducts(req, res) {
		const query = req.query;
		const { page, ...params } = query;
		const queryParams = new URLSearchParams(params).toString();
		const paginatedProducts = await productService.getProducts(query);
		if (!req.session.user) {
			return res.status(401).send({
				status: "Unauthorized",
				payload: {},
				message: "Unauthorized access",
			});
		}
		try {
			const {
				docs: products,
				hasPrevPage,
				hasNextPage,
				prevPage,
				nextPage,
			} = paginatedProducts;
			products.forEach((product) => {
				product.deletePermit =
					req.session.user.isAdmin ||
					product.owner === req.session.user.email;
				product.userCart = req.user.cart;
			});
			console.log(req.user, req.session.user.cart)
			res.render("products", {
				products,
				queryParams,
				hasPrevPage,
				hasNextPage,
				prevPage,
				nextPage,
				user: req.session.user,
			});
		} catch (error) {
			req.logger.fatal("Unknown error");
			return res.status(500).send({
				status: "error",
				payload: {},
				message: "Unknown error",
			});
		}
	}

	// Render carts view
	async renderCart(req, res) {
		const cartID = req.params.cid;
		const cart = await cartService.getCartById(cartID);
		const user = req.session.user;
		if (!cart) {
			return res.status(404).send({
				status: "error",
				payload: {},
				message: `Cannot find cart with ID: ${cartID}`,
			});
		}
		let totalAmount = 0;
		cart.products.forEach((ind) => {
			let partial = ind.product.price * ind.quantity;
			totalAmount += partial;
		});
		res.render("carts", {
			cart: cart,
			products: cart.products,
			user,
			totalAmount,
		});
	}

	// Render ticket view
	async renderTicket(req, res) {
		const user = req.session.user;
		const ticketID = req.params.tid;
		const ticket = await ticketService.getTicket(ticketID);
		res.render("ticket", { ticket, user });
	}

	// Render register view
	renderRegister(req, res) {
		res.render("register");
	}

	// Render login view
	renderLogin(req, res) {
		res.render("login");
	}

	// Render profile view
	renderProfile(req, res) {
		res.render("profile", {
			user: req.session.user,
		});
	}

	// Render the password recovery request form view
	renderPasswordRecovery(req, res) {
		res.render("forgotpassword");
	}

	// Render change password view
	renderPasswordChange(req, res) {
		try {
			const token = req.params.token;
			const authCookie = JSON.parse(req.cookies.passwordResetToken);
			if (!token === authCookie.resetToken) {
				return res.status(401).send({
					error: "unauthorized",
					message: "Unauthorized access",
				});
			}
		} catch (error) {
			return res.status(401).send({
				error: "timeout",
				message: "Unauthorized acess due to timed out connection",
			});
		}
		res.render("resetPassword");
		return res.status(200);
	}

	async renderAdminDashboard(req, res) {
		const user = req.session.user;
		const users = await userService.findAllUsers();
		const usersDTO = users.map((user) => new UserDashboardDTO(user));
		res.render("admin", { users: usersDTO, user });
	}
}

export default ViewsController;

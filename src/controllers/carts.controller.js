import {
	cartService,
	productService,
	userService,
} from "../repositories/services.js";

class CartsController {
	async createCart(req, res) {
		const newCart = await cartService.saveCart();
		const userEmail = req.session.user.email;
		const user = await userService.updateCartInUser(userEmail, newCart);
		if (!newCart) {
			req.logger.fatal("Cannot create cart");
			return res.status(500).send("Unexpected error, cannot create cart");
		}
		return res.status(200).send(newCart);
	}

	async getCart(req, res) {
		const cartID = req.params.cid;
		const cart = await cartService.getCartById(cartID);
		if (!cart) {
			req.logger.error("Cannot find cart");
			return res.status(404).send({
				status: "error",
				payload: {},
				message: `Cannot find cart with ID: ${cartID}`,
			});
		}
		try {
			return res.status(200).send({ status: "success", payload: cart });
		} catch (error) {
			req.logger.fatal("Unknown error");
			return res.status(500).send({
				status: "error",
				payload: {},
				message: "Unknown error",
			});
		}
	}

	async addProductToCart(req, res) {
		const cartID = req.user.cart._id || "";
		const productID = req.params.pid;
		const quantity = parseInt(req.query.quantity) || 1;
		const userEmail = req.user.email;
		if (req.session.user.isPremium) {
			const product = await productService.getProductById(productID);
			if (product.owner === userEmail) {
				req.logger.warning("Cannot add own product");
				return res.status(403).send({
					error: "Forbidden",
					message: "Cannot add own product",
				});
			}
		}
		const cart = await cartService.addProductToCart(
			cartID,
			productID,
			await productService.getAllProducts(),
			quantity
		);
		await userService.updateCartInUser(userEmail, cart);
		if (!cart) {
			req.logger.error("Product was not added");
			return res
				.status(400)
				.send(`Cannot add product ${productID} to cart ${cartID}`);
		}
		res.status(200).send(
			`Added product ${productID} to cart of ID: ${cartID}`
		);
	}

	async updateProductQuantity(req, res) {
		const cartID = req.params.cid;
		const productID = req.params.pid;
		const updateRequest = parseInt(req.body.quantity) || 1;
		const cart = await cartService.updateQuantityInCart(
			cartID,
			productID,
			updateRequest
		);
		if (!cart) {
			req.logger.error("Cannot update product quantity");
			return res
				.status(400)
				.send(
					`Cannot update product ${productID} quantity to cart ${cartID}`
				);
		}
		res.status(200).send(
			`Updated product ${productID} quantity in cart: ${cartID}`
		);
	}

	async updateCart(req, res) {
		const cartID = req.params.cid;
		const updateRequest = req.body;
		const validRequest = await cartService.cartValidator(updateRequest);
		if (!validRequest) {
			req.logger.error("Invalid request, cannot update products");
			return res.status(400).send({
				status: "error",
				payload: {},
				message: `Cannot update products in cart ${cartID}, invalid request`,
			});
		}
		const cart = await cartService.updateCart(cartID, updateRequest);
		if (!cart) {
			req.logger.fatal("Unknown error");
			return res.status(500).send({
				status: "error",
				payload: {},
				message: `Unknown error, cart was not updated`,
			});
		}
		res.status(200).send({
			status: "success",
			payload: { cart },
			message: `Updated cart: ${cartID}`,
		});
	}

	async deleteProductFromCart(req, res) {
		const cartID = req.params.cid;
		const productID = req.params.pid;
		const cart = await cartService.deleteProductInCart(cartID, productID);
		if (!cart) {
			req.logger.error("Product was not deleted");
			return res
				.status(400)
				.send(`Cannot delete product ${productID} in cart ${cartID}`);
		}
		res.status(200).send(`Deleted product ${productID} in cart: ${cartID}`);
	}

	async emptyCart(req, res) {
		const cartID = req.params.cid;
		const cart = await cartService.deleteAllProductsInCart(cartID);
		if (!cart) {
			req.logger.error("Cannot empty cart");
			return res.status(400).send(`Cannot empty cart ${cartID}`);
		}
		res.status(200).send(`Emptied cart: ${cartID}`);
	}

	async purchaseCart(req, res) {
		const cartID = req.params.cid;
		try {
			const cart = await cartService.getCartById(cartID);
			if (!cart) {
				req.logger.error("Cannot purchase cart");
				res.status(404).send({
					error: "Not found",
					message: "Missing data",
				});
			}
			const ticket = await cartService.purchaseCart(cart);
			res.status(200).json({
				status: "success",
				payload: ticket,
			});
		} catch (err) {
			req.logger.fatal("Unknown error");
			res.status(500).send({ error: err, message: err.message });
		}
	}
}

export default CartsController;

import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { usersOnly } from "../middleware/authentication.js";

const cartsController = new CartsController();

class CartsRouter {
	constructor() {
		this.router = Router();

		this.router.post("/", usersOnly, (req, res) => {
			cartsController.createCart(req, res);
		});

		this.router.get("/:cid", (req, res) => {
			cartsController.getCart(req, res);
		});

		this.router.post("/:cid/product/:pid", usersOnly, (req, res) => {
			cartsController.addProductToCart(req, res);
		});

		this.router.put("/:cid/products/:pid", usersOnly, (req, res) => {
			cartsController.updateProductQuantity(req, res);
		});

		this.router.put("/:cid", usersOnly, (req, res) => {
			cartsController.updateCart(req, res);
		});

		this.router.delete("/:cid/products/:pid", (req, res) => {
			cartsController.deleteProductFromCart(req, res);
		});

		this.router.delete("/:cid", (req, res) => {
			cartsController.emptyCart(req, res);
		});

		this.router.post("/:cid/purchase", usersOnly, (req, res) => {
			cartsController.purchaseCart(req, res);
		});
	}

	getRouter() {
		return this.router;
	}
}

export default new CartsRouter();

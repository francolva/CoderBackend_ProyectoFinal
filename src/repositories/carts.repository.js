import { Tickets, Users } from "../daos/factory.js";
import { productService } from "./services.js";
const ticketService = new Tickets();
const userService = new Users();

export default class CartsRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getAllCarts() {
		return await this.dao.getAll();
	}

	async getCartById(cartID) {
		return await this.dao.getById(cartID);
	}

	async saveCart() {
		return await this.dao.save();
	}

	async updateCart(cartID, cart) {
		return await this.dao.update(cartID, cart);
	}

	async updateQuantityInCart(cartID, productID, cart) {
		return await this.dao.updateQuantityOnly(cartID, productID, cart);
	}

	async cartValidator(cart) {
		return await this.dao.validator(cart);
	}

	async addProductToCart(cartID, productID, productList, quantity) {
		return await this.dao.addProduct(
			cartID,
			productID,
			productList,
			quantity
		);
	}

	async deleteProductInCart(cartID, productID) {
		return await this.dao.deleteProduct(cartID, productID);
	}

	async deleteAllProductsInCart(cartID) {
		return await this.dao.deleteAllProducts(cartID);
	}

	async deleteCart(cartID) {
		return await this.dao.delete(cartID);
	}

	async purchaseCart(cart) {
		let amount = 0;
		const products = [];
		for (const ind of cart.products) {
			let partial = ind.product.price * ind.quantity;
			amount += partial;
			let parsedProduct = await productService.getProductById(
				ind.product._id
			);
			products.push({
				name: parsedProduct.title,
				quantity: ind.quantity,
			});
			await productService.reduceStock(ind.product, ind.quantity);
		}
		const purchaser = await userService.getPurchaser(cart);
		const purchaseTicket = await ticketService.create({
			purchaser: purchaser.email,
			amount,
			products,
		});
		const purchaseTicketID = purchaseTicket._id;
		const ticketCreated = await ticketService.getById(purchaseTicketID);
		this.deleteAllProductsInCart(cart._id);
		return ticketCreated;
	}
}

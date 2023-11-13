import { cartModel } from "../../models/schemas/carts.schema.js";

export default class Carts {
	async getAll(limit) {
		let carts;
		const options = {
			lean: true,
		};
		options.limit = !limit || limit < 1 || isNaN(limit) ? 10 : limit;
		try {
			carts = await cartModel.paginate({}, options);
		} catch (error) {
			console.log("Cannot get carts");
			carts = false;
		}
		return carts;
	}

	async getById(cartID) {
		let cart;
		try {
			cart = await cartModel
				.findById(cartID)
				.populate({
					path: "products.product",
					model: "products",
				})
				.lean();
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async save() {
		let result;
		try {
			result = await cartModel.create({});
		} catch (error) {
			result = false;
		}
		return result;
	}

	async validator(request) {
		if (!request.products || !Array.isArray(request.products)) {
			return false;
		}

		for (const product of request.products) {
			if (
				!product.product ||
				!product.quantity ||
				typeof product.quantity !== "number"
			) {
				return false;
			}
		}

		return true;
	}

	async update(cartID, updateRequest) {
		let cart;
		try {
			cart = await cartModel.findByIdAndUpdate(cartID, updateRequest, {
				new: true,
			});
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async updateQuantityOnly(cartID, productID, updateRequest) {
		let cart;
		try {
			cart = await cartModel.findOneAndUpdate(
				{ _id: cartID, "products.product": productID },
				{ $set: { "products.$.quantity": updateRequest } },
				{ new: true }
			);
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async validateProduct(productID, products) {
		const findProduct = products.find(
			(product) => product._id.toString() === productID
		);
		return findProduct;
	}

	async getProduct(cart, product) {
		const productInCart = cart.products.find(
			(prod) => prod.product._id.toString() === product._id.toString()
		);
		return productInCart;
	}

	async addProduct(cartID, productID, productList, quantity = 1) {
		let result = true;
		quantity = quantity > 0 ? quantity : 1;
		let foundCart = await this.getById(cartID);
		if (!foundCart) {
			const newCart = await this.save();
			foundCart = newCart;
		}
		let parsedID = foundCart._id;
		const foundProduct = await this.validateProduct(productID, productList);
		if (!foundProduct || quantity > foundProduct.stock) {
			return (result = false);
		}
		const productInCart = await this.getProduct(foundCart, foundProduct);
		if (!productInCart) {
			const newProduct = {
				product: foundProduct._id,
				quantity: quantity,
			};
			foundCart.products.push(newProduct);
			await this.update(parsedID, foundCart);
			console.log(`Added product ${productID} to cart ${parsedID}`);
			return foundCart;
		}

		const newQuantity = quantity + productInCart.quantity;
		if (newQuantity > foundProduct.stock) {
			console.log(newQuantity, foundProduct.stock);
			console.log("Insufficient stock, product was not added to cart");
			return (result = false);
		}
		result = await this.updateQuantityOnly(
			cartID,
			foundProduct._id,
			newQuantity
		);
		console.log(`Added product ${productID} to cart ${cartID}`);
		return result;
	}

	async delete(cartID) {
		let cart;
		try {
			cart = await cartModel.deleteOne({ _id: cartID });
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async deleteProduct(cartID, productID) {
		let cart;
		try {
			cart = await cartModel.findOneAndUpdate(
				{ _id: cartID },
				{ $pull: { products: { product: productID } } },
				{ new: true }
			);
		} catch (error) {
			cart = false;
		}
		return cart;
	}

	async deleteAllProducts(cartID) {
		let cart;
		let emptyCart = { products: [] };
		try {
			cart = await this.update(cartID, emptyCart);
		} catch (error) {
			console.log(`Cannot delete products in cart ${cartID}`);
		}

		return cart;
	}
}

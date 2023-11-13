import fs from "fs";

export class Carts {
	constructor(path = "./carts.json") {
		this.carts = [];
		this.path = path;
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, "[]");
		}
	}

	async getAll() {
		const carts = await fs.promises.readFile(this.path, "utf-8");
		if (carts.length > 0) {
			this.carts = JSON.parse(carts);
			return this.carts;
		}
		return [];
	}

	async getById(cartID, carts) {
		const findCart = carts.find((cart) => cart.id === cartID);
		if (!findCart) {
			return false;
		}
		return findCart;
	}

	async validateContent(newCart) {
		let falsyValue = Object.values(newCart).some(
			(value) => !!value === false
		);
		if (falsyValue) {
			console.log("There is an invalid or missing value");
			return false;
		} else {
			return true;
		}
	}

	async validate(newCart) {
		let validation = this.validateContent(newCart);
		const carts = await this.getAll();
		const findCart = carts.find((cart) => cart.id === newCart.id);
		if (findCart) {
			console.log("ID already exists");
			return false;
		}
		return validation;
	}

	async update(cartID, updatedCart) {
		const carts = await this.getAll();
		let validation = await this.validateContent(updatedCart);
		if (!validation) {
			console.log("Invalid cart");
			return validation;
		}
		const findCart = await this.getById(cartID, carts);
		if (!findCart) {
			console.log("Error updating cart");
			return (validation = false);
		}
		Object.assign(findCart, updatedCart);
		await this.insert(carts);
		console.log(`Updated cart with ID ${cartID}`);
		return validation;
	}

	async updateQuantityOnly(cartID, productID, updateRequest) {
		const carts = await this.getAll();
		const findCart = await this.getById(cartID, carts);
		const findProduct = findCart.products.find(
			(product) => product.id == productID
		);
		Object.assign(findProduct.quantity, updateRequest);
		await this.insert(carts);
		console.log("Updated quantity");
		let cart;
		try {
			const findCart = await this.getById(cartID, carts);
			const findProduct = await this.getProduct(productID, findCart)
			Object.assign(findProduct.quantity, updateRequest);
			await this.insert(carts);
			console.log("Updated quantity");
			return true;
		} catch (error) {
			console.log("Unable to update product quantity");
			return false;
		}
	}

	async validateProduct(productID, allProducts) {
		const findProduct = allProducts.find(
			(product) => product.id === productID
		);
		return findProduct;
	}

	async getProduct(productID, cart) {
		const productInCart = cart.products.find(
			(product) => product.id === productID
		);
		return productInCart;
	}

	async insert(carts) {
		await fs.promises.writeFile(
			this.path,
			JSON.stringify(carts),
			(error) => {
				console.log(error);
			}
		);
		return;
	}

	async save(cart) {
		let validation = await this.validate(cart);
		if (!validation) {
			console.log("Invalid cart");
			return validation;
		}
		const carts = await this.getAll();
		const newCarts = [...carts, cart];
		await this.insert(newCarts);
		console.log(`Added cart with ID ${cart.id}`);
		return validation;
	}

	async addProduct(cartID, productID, allProducts) {
		let validation = true;
		const carts = await this.getAll();
		const foundCart = await this.getById(cartID, carts);
		const foundProduct = await this.validateProduct(productID, allProducts);
		if (!foundProduct || !foundCart) {
			return (validation = false);
		}
		const productInCart = await this.getProduct(productID, foundCart);
		let newProduct = { id: productID, quantity: 1 };
		if (!productInCart) {
			const newProducts = [...foundCart.products, newProduct];
			Object.assign(foundCart.products, newProducts);
			await this.insert(carts);
			console.log(`Added product ${productID} to cart ${cartID}`);
			return validation;
		}
		newProduct.quantity = productInCart.quantity + 1;
		Object.assign(productInCart, newProduct);
		await this.insert(carts);
		console.log(`Added product ${productID} to cart ${cartID}`);
		return validation;
	}
}

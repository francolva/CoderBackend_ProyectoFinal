import fs from "fs";

export class Products {
	constructor(path) {
		this.path = path;
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, "[]");
		}
	}

	async getAll() {
		return this.get();
	}

	async get() {
		const products = await fs.promises.readFile(this.path, "utf-8");
		return products.length > 0 ? JSON.parse(products) : [];
	}

	async getById(productID, products) {
		const findProduct =
			products.find((product) => product.id === productID) || false;
		return findProduct;
	}

	async validateContent(newProduct) {
		const falsyValue = Object.values(newProduct).some(
			(value) => !!value === false && value !== 0
		);
		if (falsyValue) {
			console.error("There is an invalid or missing value");
			return false;
		}
		return true;
	}

	async validateID(newProduct, products) {
		const existingProduct = await this.getById(
			newProduct.id,
			products
		);
		if (existingProduct) {
			console.error("ID already exists");
			return false;
		}
		return true;
	}

	async insert(products) {
		await fs.promises.writeFile(
			this.path,
			JSON.stringify(products),
			(error) => {
				console.error(error);
			}
		);
		return;
	}

	async save(product) {
		const products = await this.get();
		const validContent = await this.validateContent(product);
		const validID = await this.validateID(product, products);
		const validation = validContent && validID;
		if (!validation) {
			console.log("Invalid product");
			return validation;
		}
		const newProducts = [...products, product];
		await this.insert(newProducts);
		console.log("Added product with ID", `${product.id}`);
		return validation;
	}

	async update(productID, updatedProduct) {
		const products = await this.get();
		let validation = await this.validateContent(updatedProduct);
		if (!validation) {
			console.log("Invalid updated product");
			return validation;
		}
		const findProduct = await this.getById(productID, products);
		if (!findProduct) {
			console.log("Error updating product", `${productID}`);
			return (validation = false);
		}
		Object.assign(findProduct, updatedProduct);
		await this.insert(products);
		console.log("Updated product with ID", `${productID}`);
		return validation;
	}

	async delete(productID) {
		const products = await this.getAll();
		let validation = true;
		const findProduct = await this.getById(productID, products);
		if (!findProduct) {
			console.log("Error removing product", `${productID}`);
			return (validation = false);
		}
		const productIndex = products.findIndex(
			(product) => product === findProduct
		);
		products.splice(productIndex, 1);
		await this.insert(products);
		console.log("Deleted product with ID", `${productID}`);
		return validation;
	}
}

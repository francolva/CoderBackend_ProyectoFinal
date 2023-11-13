export default class ProductsRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getAllProducts() {
		try {
			return await this.dao.getAll();
		} catch (error) {
			throw new Error(error);
		}
	}

	async getProducts(payload) {
		return await this.dao.get(payload);
	}

	async getProductById(id) {
		try {
			return await this.dao.getById(id);
		} catch (error) {
			throw new Error(error);
		}
	}

	async saveProduct(payload, owner) {
		try {
			return await this.dao.save(payload, owner);
		} catch (error) {
			throw new Error(error);
		}
	}

	async updateProduct(id, payload) {
		try {
			return await this.dao.update(id, payload);
		} catch (error) {
			throw new Error(error);
		}
	}

	async reduceStock(product, quantity) {
		const productID = product._id;
		const newStock = product.stock - quantity;
		if (newStock < 0) {
			throw new Error("Not enough stock");
		} else {
			return await this.updateProduct(productID, { stock: newStock });
		}
	}

	async deleteProduct(id) {
		try {
			return await this.dao.delete(id);
		} catch (error) {
			throw new Error(error);
		}
	}

	async deleteUserProducts(user) {
		try {
			const userProducts = await this.dao.getByUser(user);
			if (userProducts) {
				userProducts.forEach((product) => {
					const deletedProduct = this.deleteProduct(product._id);
					return deletedProduct;
				});
			} else {
				return;
			}
		} catch (error) {
			console.log(`Cannot delete all products of user ${user.email}`);
			throw new Error(error);
		}
	}
}

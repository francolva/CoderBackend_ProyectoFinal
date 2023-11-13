import { productModel } from "../../models/schemas/products.schema.js";

export default class Products {
	async getAll() {
		let products;
		try {
			products = await productModel.find().lean();
		} catch (error) {
			console.log("Error loading products");
			products = false;
		}
		return products;
	}

	async getByUser(user) {
		let products;
		try {
			products = await productModel.find({ owner: user.email });
		} catch (error) {
			console.log("Error loading products");
			products = false;
		}
		return products;
	}

	async get(queryParams) {
		let products;
		const { limit: limit, page: page, sort: sort, ...query } = queryParams;
		let sortValue;
		if (sort) {
			switch (sort) {
				case "asc":
					{
						sortValue = { price: 1 };
					}
					break;
				case "desc":
					{
						sortValue = { price: -1 };
					}
					break;
				default: {
					sortValue = {};
				}
			}
		}

		const options = {
			limit: parseInt(limit) < 1 || isNaN(limit) ? 10 : parseInt(limit),
			page: parseInt(page) < 1 || isNaN(page) ? 1 : parseInt(page),
			sort: sortValue,
			lean: true,
		};

		try {
			products = await productModel.paginate(query, options);
			if (products.page > products.totalPages) {
				options.page = products.totalPages;
				products = await productModel.paginate(query, options);
			}
		} catch (error) {
			console.log("Error getting products");
			products = false;
		}
		return products;
	}

	async getById(productID) {
		let product;
		try {
			product = await productModel.findById(productID).lean();
		} catch (error) {
			product = false;
		}
		return product;
	}

	async save(product, owner) {
		let result;
		const productRequest = { ...product, owner: owner };
		try {
			result = await productModel.create(productRequest);
		} catch (error) {
			result = false;
		}
		return result;
	}

	async update(productID, updateRequest) {
		let product;
		try {
			product = await productModel.findByIdAndUpdate(
				productID,
				updateRequest
			);
		} catch (error) {
			product = false;
		}
		return product;
	}

	async delete(productID) {
		let result;
		try {
			result = await productModel.deleteOne({ _id: productID });
		} catch (error) {
			result = false;
		}
		return result;
	}
}

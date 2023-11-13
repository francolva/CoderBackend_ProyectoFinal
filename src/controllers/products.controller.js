import { mailingService, productService } from "../repositories/services.js";
import { deletedProduct } from "../services/mailing/mailingTemplates.js";
import customError from "../utils/errors/customError.js";
import EErrors from "../utils/errors/errorCodes.js";
import { generateProductErrorInfo } from "../utils/errors/errorInfo.js";

export default class ProductsController {
	async getProducts(req, res) {
		try {
			const query = req.query;
			const paginatedProducts = await productService.getProducts(query);
			const { docs: products, ...paginationInfo } = paginatedProducts;
			return res.status(200).send({
				status: "success",
				payload: products,
				...paginationInfo,
			});
		} catch (error) {
			req.logger.error("Unkown error");
			return res.status(500).send({
				status: "error",
				payload: {},
				message: "Unknown error",
			});
		}
	}

	async getProductById(req, res) {
		const productID = req.params.pid;
		const product = await productService.getProductById(productID);
		if (!product) {
			req.logger.error("Product not found");
			return res
				.status(404)
				.send(`Cannot find product with ID: ${productID}`);
		}
		return res.status(200).send(product);
	}

	async createProduct(req, res) {
		const productRequest = req.body;
		const owner = req.session.user.isPremium
			? req.session.user.email
			: "admin";
		const result = await productService.saveProduct(productRequest, owner);
		if (!result) {
			req.logger.error("InputError");
			customError.createError({
				name: "InputError",
				cause: "Invalid or missing input",
				message: generateProductErrorInfo(productRequest),
				code: EErrors.INVALID_INPUT_ERROR,
			});
		}
		let msg = Array.isArray(result)
			? "Products created successfully"
			: `Created product "${result.title}" of ID: ${result._id}`;
		return res.status(200).send(msg);
	}

	async updateProductById(req, res) {
		const productID = req.params.pid;
		const updateProductRequest = req.body;
		const product = await productService.updateProduct(
			productID,
			updateProductRequest
		);
		if (!product) {
			req.logger.error("Cannot update product");
			return res
				.status(400)
				.send(
					`Cannot update product of ID: ${productID}, check the ID or the product values`
				);
		}
		res.status(200).send(`Updated product of ID: ${productID}`);
	}

	async deleteProductById(req, res) {
		let result;
		const productID = req.params.pid;

		if (req.session.user.isPremium) {
			const product = await productService.getProductById(productID);
			if (product.owner === req.session.user.email) {
				result = await productService.deleteProduct(productID);
				const mailTemplate = deletedProduct(product.title);
				await mailingService.send({
					to: req.session.user.email,
					...mailTemplate,
				});
			} else {
				req.logger.warning("Cannot delete product");
				return res.status(403).send({
					error: "Forbidden",
					message: "Cannot delete foreign product",
				});
			}
		} else {
			const product = await productService.getProductById(productID);
			result = await productService.deleteProduct(productID);
			const mailTemplate = deletedProduct(product.title);
			await mailingService.send({
				to: product.owner,
				...mailTemplate,
			});
		}

		if (!result) {
			req.logger.warning("Cannot delete product");
			return res
				.status(404)
				.send(
					`Cannot delete inexistent product. Check ID: ${productID}`
				);
		} else {
			res.status(200).send(`Deleted product of ID: ${productID}`);
		}
	}
}

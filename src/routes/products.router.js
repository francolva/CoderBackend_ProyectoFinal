import { Router } from "express";
import { hasAdvancedRights } from "../middleware/authentication.js";
import ProductsController from "../controllers/products.controller.js";

const productsController = new ProductsController();

class ProductsRouter {
	constructor() {
		this.router = Router();

		// Get products with query and pagination
		this.router.get("/", async (req, res) => {
			productsController.getProducts(req, res);
		});

		// Get product by ID
		this.router.get("/:pid", async (req, res) => {
			productsController.getProductById(req, res);
		});

		// // Create product
		this.router.post("/", hasAdvancedRights, async (req, res) => {
			productsController.createProduct(req, res);
		});

		// Update product
		this.router.put("/:pid", hasAdvancedRights, async (req, res) => {
			productsController.updateProductById(req, res);
		});

		// Delete product
		this.router.delete("/:pid", hasAdvancedRights, async (req, res) => {
			productsController.deleteProductById(req, res);
		});
	}

	getRouter() {
		return this.router;
	}
}

export default new ProductsRouter();

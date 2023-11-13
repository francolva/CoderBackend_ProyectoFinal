import { Router } from "express";
import { generateProduct } from "../mocking/mocking.module.js";

class MockingRouter {
	constructor() {
		this.router = Router();

		this.router.get("/", async (req, res) => {
			let products = [];
			for (let i = 0; i < 100; i++) {
				products.push(generateProduct());
			}
			res.send(products)
		});
	}

    getRouter() {
        return this.router;
    }
}

export default new MockingRouter();

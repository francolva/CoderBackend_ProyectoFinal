import CONFIG from "../config/config.js";
import { MongoManager } from "../config/mongoManager.js";
export let Products;
export let Carts;
export let Messages;
export let Users;
export let Tickets;

switch (CONFIG.PERSISTANCE) {
	case "MONGO":
		MongoManager.start();
		const { default: ProductsMongo } = await import(
			"./mongo/products.mongo.js"
		);
		const { default: CartsMongo } = await import("./mongo/carts.mongo.js");
		const { default: MessagesMongo } = await import(
			"./mongo/messages.mongo.js"
		);
		const { default: UsersMongo } = await import("./mongo/users.mongo.js");
		const { default: TicketsMongo } = await import("./mongo/tickets.mongo.js");
		Products = ProductsMongo;
		Carts = CartsMongo;
		Messages = MessagesMongo;
		Users = UsersMongo;
		Tickets = TicketsMongo;
		break;
	case "FILE":
		const { Products: ProductsFile } = await import(
			"./file/products.file.js"
		);
		const { Carts: CartsFile } = await import("./file/carts.file.js");
		const { default: MessagesFile } = await import(
			"./file/messages.file.js"
		);
		Products = ProductsFile;
		Carts = CartsFile;
		Messages = MessagesFile;
		Users = "";
		Tickets = "";
		break;
	default: {
		throw new Error("Invalid persistance model");
	}
}

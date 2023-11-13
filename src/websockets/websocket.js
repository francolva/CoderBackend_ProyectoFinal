import { Server as WebSocketServer } from "socket.io";
import { messageService, productService } from "../repositories/services.js";

let io;

export function initializeWebSocket(server) {
	const io = new WebSocketServer(server, {
		cors: {
			methods: ["GET", "POST"],
			credentials: true,
			transports: ["websocket", "polling"],
		},
		allowEIO3: true,
	});

	// Initialize message list
	let messages = [];

	io.on("connection", (socket) => {
		// Socket management for realTimeProducts view
		socket.on("client:newProduct", async (newProduct, owner) => {
			const parsedProduct = await productService.saveProduct(
				newProduct,
				owner
			);
			if (!parsedProduct) {
				console.log("Error creating the product, verify the input");
				return;
			} else {
				console.log("Form received");
				const updatedProducts = await productService.getAllProducts();
				socket.emit("server:renderProducts", updatedProducts);
			}
		});

		// Socket management for chat view
		socket.on("client:userLogged", (user) => {
			socket.broadcast.emit("server:userLogged", (user = user));
			messageService.saveUser(user);
			io.emit("messageLogs", messages);
		});

		socket.on("client:message", (data) => {
			messages.push(data);
			messageService.saveUserMessage(data.user, data.message);
			io.emit("server:messageLogs", messages);
		});

		// Socket disconnected
		socket.on("disconnect", () => {
			console.log("A user disconnected");
		});
	});
}

export function getIo() {
	return io;
}

import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		default: "T" + Date.now().toString(),
	},
	purchase_datetime: {
		type: Date,
		default: Date.now(),
	},
	amount: {
		type: Number,
		required: true,
		default: 0,
	},
	purchaser: {
		type: String,
		required: true,
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "products",
			},
			name: {
				type: String,
			},
			quantity: {
				type: Number,
				required: true,
				default: 0,
			},
		},
	],
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;

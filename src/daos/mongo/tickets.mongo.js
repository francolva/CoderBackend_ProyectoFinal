import ticketModel from "../../models/schemas/ticket.schema.js";

export default class Tickets {
	async getById(ticketID) {
		let ticket;
		try {
			ticket = await ticketModel.findById(ticketID).lean();
		} catch (error) {
			ticket = false;
		}
		return ticket;
	}

	async create({ purchaser, ...ticket }) {
		let result;
		try {
			result = await ticketModel.create({
				purchaser: purchaser,
				...ticket,
			});
		} catch (error) {
			console.log("error: ", error);
			result = false;
		}
		return result;
	}
}

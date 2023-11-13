export default class TicketRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getTicket(ticketID) {
		return await this.dao.getById(ticketID);
	}
}

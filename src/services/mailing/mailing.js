import mailer from "nodemailer";
import CONFIG from "../../config/config.js";

export default class MailingService {
	constructor() {
		this.client = mailer.createTransport({
			service: CONFIG.mailing.SERVICE,
			port: 587,
			auth: {
				user: CONFIG.mailing.USER,
				pass: CONFIG.mailing.PASSWORD,
			},
		});
	}

	async send({ to, from, subject, html, attachments = [] }) {
		let result = await this.client.sendMail({
			to,
			from,
			subject,
			html,
			attachments,
		});
		console.log('Email sent')
		return result;
	}
}

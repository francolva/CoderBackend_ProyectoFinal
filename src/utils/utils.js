import bcrypt from "bcrypt";
import CONFIG from "../config/config.js";

export function createHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function isValidPassword(user, password) {
	return bcrypt.compareSync(password, user.password);
}

export function generateToken() {
	const token = new Buffer.from(
		`${CONFIG.SESSION_SECRET}${Date.now()}`,
		"base64"
	).toString("hex");
	console.log(token);
	return token;
}

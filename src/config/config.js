import dotenv from "dotenv";
import args from "./params.js";
import * as path from "path";

const environment = args.mode; // development - production
const envPath = path.join(process.cwd(), "src", `.env.${environment}`);

dotenv.config({
	path: envPath,
});

const CONFIG = {
	NODE_ENV: environment,
	PERSISTANCE: process.env.PERSISTANCE || "MONGO",
	TTL: process.env.TTL || 3600,
	SESSION_SECRET: process.env.SESSION_SECRET || "",
	ADMIN: process.env.ADMIN,
	mongo: {
		PORT: process.env.PORT || "8080",
		URL: process.env.MONGO_URI,
	},
	github: {
		CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
	},
	mailing: {
		USER: process.env.MAILING_USER,
		PASSWORD: process.env.MAILING_PASSWORD,
		SERVICE: process.env.MAILING_SERVICE,
	},
};

export default CONFIG;

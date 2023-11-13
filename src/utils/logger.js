import winston from "winston";
import CONFIG from "../config/config.js";

// Customize logger
const customLevelOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5,
	},
	colors: {
		fatal: "red",
		error: "magenta",
		warning: "yellow",
		info: "green",
		http: "blue",
		debug: "white",
	},
};

// Create a Winston logger instance
const developmentLogger = winston.createLogger({
	levels: customLevelOptions.levels,
	transports: [
		new winston.transports.Console({
			level: "debug",
			format: winston.format.combine(
				winston.format.colorize({ colors: customLevelOptions.colors }),
				winston.format.simple()
			),
		}),
	],
});

const productionLogger = winston.createLogger({
	levels: customLevelOptions.levels,
	transports: [
		new winston.transports.Console({
			level: "info",
			format: winston.format.combine(
				winston.format.colorize({ colors: customLevelOptions.colors }),
				winston.format.simple()
			),
		}),
		new winston.transports.File({
			filename: "./errors.log",
			level: "error",
		}),
	],
});

// Create logger middleware
export const addLogger = (req, res, next) => {
	req.logger =
		CONFIG.NODE_ENV === "production" ? productionLogger : developmentLogger;
	req.logger.http(
		`${req.method} in ${req.url} ${new Date().toLocaleTimeString()}`
	);
	next();
};

export const infoLogger = (message) => {
	const logger = CONFIG.NODE_ENV === "production" ? productionLogger : developmentLogger;
	logger.info(`${message} ${new Date().toLocaleTimeString()}`);
}

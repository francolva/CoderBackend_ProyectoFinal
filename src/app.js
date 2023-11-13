import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import http from "http";
import CONFIG from "./config/config.js";
import AppRouter from "./routes/app.router.js";
import { initializeWebSocket, getIo } from "./websockets/websocket.js";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { infoLogger } from "./utils/logger.js";

// Initialize HTTP and Socket server
const app = express();
const server = http.createServer(app);
const io = getIo();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize middleware for data processing methods
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set handlebars as view engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Initialize public static folder
app.use(express.static(__dirname + "/public"));

// Initialize user session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: CONFIG.mongo.URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: CONFIG.TTL,
		}),
		secret: CONFIG.SESSION_SECRET,
		cookie: { maxAge: 1000 * 60 * 60 * 1 }, // ms/s * s/min * min/hr * hr
		resave: false,
		saveUninitialized: false,
	})
);

// Initialize passport authentication and authorization middleware
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Set routes
app.use("/", AppRouter);

// // Begin socket management
initializeWebSocket(server);
app.set("socketio", io);

// Server listening on given port
server.listen(CONFIG.mongo.PORT, () => {
	infoLogger(`Environment: ${CONFIG.NODE_ENV}`);
	infoLogger(`Server starting on port ${CONFIG.mongo.PORT}`);
});

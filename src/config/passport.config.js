import passport from "passport";
import local from "passport-local";
import { userService } from "../repositories/services.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import githubService from "passport-github2";
import CONFIG from "./config.js";
import { infoLogger } from "../utils/logger.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
	passport.use(
		"register",
		new LocalStrategy(
			{ passReqToCallback: true, usernameField: "email" },
			async (req, username, password, done) => {
				const { firstName, lastName, email, age } = req.body;
				try {
					let user = await userService.findUserByEmail(email);
					if (user) {
						infoLogger("User already exists");
						return done(null, false);
					}
					let isAdmin = email === CONFIG.ADMIN ? true : false;
					const newUser = {
						firstName,
						lastName,
						email,
						age,
						password: createHash(password),
						role: isAdmin ? "admin" : "user",
						lastLogin: new Date(),
						active: true,
					};
					let result = await userService.createUser(newUser);
					return done(null, result);
				} catch (error) {
					return done(`User error ${error}`);
				}
			}
		)
	);
	passport.use(
		"login",
		new LocalStrategy(
			{ passReqToCallback: true, usernameField: "email" },
			async (req, email, password, done) => {
				try {
					const user = await userService.findUserByEmail(email);
					if (!user) {
						return done(null, false, {
							message: "User does not exist",
						});
					}
					if (!isValidPassword(user, password)) {
						return done(null, false, {
							message: "Invalid password",
						});
					}
					user.active = true;
					user.lastLogin = new Date();
					return done(null, user);
				} catch (error) {
					return done(null, false);
				}
			}
		)
	);

	passport.use(
		"github",
		new githubService(
			{
				clientID: CONFIG.github.CLIENT_ID,
				clientSecret: CONFIG.github.CLIENT_SECRET,
				callbackURL: CONFIG.github.CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userService.findUserByEmail(
						profile._json.email
					);
					let isAdmin =
						profile._json.email === CONFIG.ADMIN ? true : false;
					if (!user) {
						let newUser = {
							firstName: profile._json.name,
							lastName: "",
							email: profile._json.email,
							age: "",
							password: "",
							role: isAdmin ? "admin" : "user",
							lastLogin: new Date(),
							active: true,
						};
						let result = await userService.createUser(newUser);
						done(null, result);
					} else {
						done(null, user);
					}
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		let user = await userService.findUserByID(id);
		done(null, user);
	});
};

export default initializePassport;

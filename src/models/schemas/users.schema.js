import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
	},
	password: {
		type: String,
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Carts",
		default: null,
	},
	role: {
		type: String,
		enum: ["user", "admin", "premium"],
		default: "user",
	},
	lastLogin: {
		type: Date,
		default: "none",
	},
	active: {
		type: Boolean,
		default: true,
	},
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;

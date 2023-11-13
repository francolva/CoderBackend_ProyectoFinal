import EErrors from "../utils/errors/errorCodes.js";

export const errorHandler = (error, req, res, next) => {
	switch (error.code) {
		case EErrors.INVALID_INPUT_ERROR:
			res.send({ status: "Error", error: error.name });
			break;
		default:
			res.send({ status: "Error", error: "Unknown Error" });
	}
};

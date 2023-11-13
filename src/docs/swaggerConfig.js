import { dirname } from "path";

const rootDir = dirname(process.argv[1]);

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "CoderBackend API",
			version: "1.0.0",
			description: "OpenAPI project documentation",
		},
	},
	apis: [`${rootDir}/docs/**/*.yaml`],
};

export default swaggerOptions;

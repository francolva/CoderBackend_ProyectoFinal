import { Router } from "express";
import ProductsRouter from "./products.router.js";
import CartsRouter from "./carts.router.js";
import SessionRouter from "./sessions.router.js";
import UsersRouter from "./users.router.js";
import ViewsRouter from "./views/views.router.js";
import MockingRouter from "./mocking.router.js";
import LoggerRouter from "./loggerTest.js";
import { addLogger } from "../utils/logger.js";
import { isAuth, userRole } from "../middleware/authentication.js";
import { errorHandler } from "../middleware/errorHandler.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import swaggerOptions from "../docs/swaggerConfig.js";

const router = Router();
const specs = swaggerJSDoc(swaggerOptions);

// Set common use middlewares
router.use(addLogger, errorHandler);

// Set routes
router.use("/api/products", isAuth, userRole, ProductsRouter.getRouter());
router.use("/api/carts", isAuth, userRole, CartsRouter.getRouter());
router.use("/api/sessions", SessionRouter.getRouter());
router.use("/api/users", isAuth, userRole, UsersRouter.getRouter());
router.use("/", ViewsRouter.getRouter());
router.use("/mockingproducts", MockingRouter.getRouter());
router.use("/loggertest", LoggerRouter);
router.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

export default router;

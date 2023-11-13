import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
	req.logger.debug("Test debug logger");
	req.logger.http("Test http logger");
	req.logger.info("Test info logger");
	req.logger.warning("Test warning logger");
	req.logger.error("Test error logger");
	req.logger.fatal("Test fatal logger");
	res.send("Testing loggers");
});

export default router;

// Create authentication middleware
export const isAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		req.logger.info("User authenticated");
		return next();
	} else {
		req.logger.warning("Needs authentication");
		return res.redirect("/login");
	}
};

export const userRole = (req, res, next) => {
	switch (req.user.role) {
		case "premium":
			req.session.user.isAdmin = false;
			req.session.user.isPremium = true;
			req.session.user.hasAdvancedRights = true;
			break;

		case "user":
			req.session.user.isAdmin = false;
			req.session.user.isPremium = false;
			req.session.user.hasAdvancedRights = false;
			break;

		case "admin":
			req.session.user.isAdmin = true;
			req.session.user.isPremium = false;
			req.session.user.hasAdvancedRights = true;
			break;
	}
	return next();
};

export const hasAdvancedRights = (req, res, next) => {
	const advancedRightsRoles = ["admin", "premium"];
	if (advancedRightsRoles.includes(req.session.user.role)) {
		req.session.user.hasAdvancedRights = true;
		return next();
	} else {
		req.session.user.hasAdvancedRights = false;
		req.logger.error("Forbidden");
		return res.status(403).send("Forbidden resource");
	}
};

export const usersOnly = (req, res, next) => {
	if (req.session.user.isAdmin) {
		req.logger.warning("Cannot access with admin rights");
		return res.status(403).send("Forbidden");
	} else {
		next();
	}
};

export const adminOnly = (req, res, next) => {
	if (req.session.user.isAdmin) {
		next();
	} else {
		req.logger.warning("Cannot access without admin rights");
		return res.status(403).send("Forbidden");
	}
};

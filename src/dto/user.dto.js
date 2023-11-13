export class UsersDTO {
	constructor(user) {
		this.full_name = `${user.firstName} ${user.lastName}`;
		this.email = user.email;
		this.role = user.role;
		this.isPremium = user.role === "premium";
	}
}

export class UserDashboardDTO {
	constructor(user) {
		this.full_name = `${user.firstName} ${user.lastName}`;
		this.email = user.email;
		this.role = user.role;
		this.lastLogin = user.lastLogin ? user.lastLogin.toLocaleString() : "";
	}
}

export class CurrentUserDTO {
	constructor(user) {
		this.full_name = `${user.firstName} ${user.lastName}`;
		this.email = user.email;
		this.cart = user.cart;
		this.role = user.role;
	}
}

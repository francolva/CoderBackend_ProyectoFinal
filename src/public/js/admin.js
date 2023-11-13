const deleteInactiveUsers = document.getElementById("delete-inactive");

deleteInactiveUsers.addEventListener("click", async (e) => {
	e.preventDefault();

	try {
		const response = await fetch("/api/users", {
			method: "DELETE",
		}).then(() => {
			window.location.reload();
		});
	} catch (error) {
		alert("An error occurred. Please try again later.");
	}
});

document.addEventListener("DOMContentLoaded", function () {
	const changeRoleButtons =
		document.getElementsByClassName("changeRoleButtons");
	const deleteButtons = document.getElementsByClassName("deleteUserButtons");

	if (changeRoleButtons) {
		for (const changeRoleButton of changeRoleButtons) {
			changeRoleButton.addEventListener("click", function () {
				const userEmail = this.getAttribute("data-user-email");
				const userRole = this.getAttribute("data-user-role");
				const data = { user: { email: userEmail, role: userRole } };

				try {
					fetch("/api/users/changeuserrole", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json;charset=utf-8",
						},
						body: JSON.stringify(data),
					}).then((response) => {
						if (response.ok) {
							window.location.reload();
						}
					});
				} catch (error) {
					console.log(error);
					alert("An error occurred. Please try again later.");
				}
			});
		}
	}

	if (deleteButtons) {
		for (const deleteButton of deleteButtons) {
			deleteButton.addEventListener("click", function () {
				const userEmail = this.getAttribute("data-user-email");
				const data = { user: { email: userEmail } };

				try {
					fetch("/api/users/deleteuser", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json;charset=utf-8",
						},
						body: JSON.stringify(data),
					}).then((response) => {
						if (response.ok) {
							window.location.reload();
						}
					});
				} catch (error) {
					console.log(error);
					alert("An error occurred. Please try again later.");
				}
			});
		}
	}
});

const form = document.getElementById("newPasswordForm");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const data = new FormData(form);
	const obj = {};
	data.forEach((value, key) => (obj[key] = value));
	if (obj.password === obj.password_repeat) {
		try {
			// Send a POST request to recover the user's password
			const response = await fetch("/api/sessions/reset", {
				method: "POST",
				body: JSON.stringify(obj),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				alert("Password succesfully changed");
				window.location.replace("/login");
			} else {
				alert("Cannot use previous password");
				window.location.replace("/forgotpassword");
			}
		} catch (error) {
			alert("Unexpected error");
		}
	} else {
		alert("Passwords should match, please try again.");
	}
});

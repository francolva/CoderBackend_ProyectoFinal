const form = document.getElementById("recoverForm");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const data = new FormData(form);
	const obj = {};
	data.forEach((value, key) => (obj[key] = value));
	try {
		// Send a POST request to recover the user's password
		const response = await fetch("/api/sessions/forgotpassword", {
			method: "POST",
			body: JSON.stringify(obj),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
            alert("Password reset mail sent")
			window.location.replace("/login");
		} else {
			alert("An error occurred. Please verify the email provided.");
		}
	} catch (error) {
		alert("Unexpected error");
	}
});

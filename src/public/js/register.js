const form = document.getElementById("registerForm");


form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const data = new FormData(form);
	const obj = {};
	data.forEach((value, key) => (obj[key] = value));

	try {
		// Send a POST request to register the user
		const response = await fetch("/api/sessions/register", {
			method: "POST",
			body: JSON.stringify(obj),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			window.location.replace("/login");
		} else {
			alert("An error occurred");
		}
	} catch (error) {
		alert("Unexpected error");
	}
});

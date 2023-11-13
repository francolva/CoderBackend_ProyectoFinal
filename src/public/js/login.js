const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const data = new FormData(form);
	const obj = {};
	data.forEach((value, key) => (obj[key] = value));

	try {
		const response = await fetch("/api/sessions/login", {
			method: "POST",
			body: JSON.stringify(obj),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const responseData = await response.json();

		if (response.status === 200) {
			window.location.replace("/products");
			localStorage.setItem('token', responseData.accessToken)
		} else if (response.status === 401) {
			alert(responseData.message);
		} else {
			alert("An error occurred");
		}
	} catch (error) {
		alert("An error occurred. Please try again later.");
	}
});

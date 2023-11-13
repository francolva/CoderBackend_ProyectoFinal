const logoutButton = document.getElementById("logout-button");


logoutButton.addEventListener("click", async (e) => {
	e.preventDefault();

	try {
		const response = await fetch("/api/sessions/logout", {
			method: "POST",
		});

		if (response.status === 200) {
			window.location.replace("/login");
		} else {
			alert("An error occurred");
		}
	} catch (error) {
		alert("An error occurred. Please try again later.");
	}
});

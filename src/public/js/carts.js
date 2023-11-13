document.addEventListener("DOMContentLoaded", function () {
	const purchaseButton = document.getElementById("purchase-button");

	if (purchaseButton) {
		purchaseButton.addEventListener("click", function () {
			const cartID = this.getAttribute("data-cart-id");

			if (confirm("Are you sure you want buy this cart?")) {
				fetch(`/api/carts/${cartID}/purchase`, {
					method: "POST",
				})
					.then((response) => {
						if (response.ok) {
							console.log("Succesfully bought products");
							response
								.json()
								.then((data) =>
									window.location.replace(
										`/ticket/${data.payload._id}`
									)
								);
						} else {
							console.log("Something went wrong");
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		});
	}
});

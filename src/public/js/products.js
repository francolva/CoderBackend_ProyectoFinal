document.addEventListener("DOMContentLoaded", function () {
	const deleteButtons = document.getElementsByClassName(
		"deleteProductButton"
	);

	if (deleteButtons) {
		for (const deleteButton of deleteButtons) {
			deleteButton.addEventListener("click", function () {
				const productId = this.getAttribute("data-product-id");

				if (confirm("Are you sure you want to delete this product?")) {
					fetch(`/api/products/${productId}`, {
						method: "DELETE",
					})
						.then((response) => {
							if (response.ok) {
								console.log("Succesfully deleted product");
								window.location.reload();
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
	}
	const addToCartButtons = document.querySelectorAll(".addToCart");

	addToCartButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const productId = this.getAttribute("data-product-id");
			const cartID = this.getAttribute("data-cart");
			fetch(`/api/carts/${cartID}/product/${productId}`, {
				method: "POST",
			})
				.then((response) => {
					if (response.ok) {
						console.log("Successfully added product to cart");
						Swal.fire({
							text: "Producto agregado al carrito",
							toast: true,
							position: "bottom-right",
							timer: 5000,
							hideClass: {
								popup: "animated fadeOutUp faster",
							},
						});
					} else {
						console.log("Something went wrong");
					}
				})
				.catch((error) => {
					console.log("Error:", error);
				});
		});
	});
});

export function generateProductErrorInfo(product) {
	return `One or more properties were incomplete or invalid.
	List of required properties:
    * title { type: String }, received ${typeof(product.title)}, ${product.title}
    * description { type: String }, received ${typeof(product.description)}, ${product.description}
    * code { type: String }, received ${typeof(product.code)}, ${product.code}
    * price { type: Number }, received ${typeof(product.price)}, ${product.price}
    * status { type: Boolean }, received ${typeof(product.status)}, ${product.status}
    * stock { type: Number }, received ${typeof(product.stock)}, ${product.stock}
    * category { type: String }, received ${typeof(product.category)}, ${product.category}
    * title { type: String }, received ${typeof(product.title)}, ${product.thumbnail}`
}

export function generateUserErrorInfo(user) {
	return `One or more properties were incomplete or invalid.
	List of required properties:
    * email { type: String }, received ${user?.email}`
}


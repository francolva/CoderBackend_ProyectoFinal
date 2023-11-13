import { Faker, en, es } from "@faker-js/faker";

// Added english locale because of missing productDescription
const faker = new Faker({locale:[es, en]});

export function generateProduct() {
	return {
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		code: faker.commerce.isbn(),
		price: parseFloat(faker.commerce.price()),
		status: faker.datatype.boolean({ probability: 0.8 }),
		stock: faker.number.int(),
		category: faker.commerce.productAdjective(),
		thumbnail: faker.image.url(),
	};
}

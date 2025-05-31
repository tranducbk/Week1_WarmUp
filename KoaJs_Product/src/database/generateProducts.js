const fs = require("fs");
const { faker } = require("@faker-js/faker");
const path = require("path");

const NUM_PRODUCTS = 10;

const products = [];

for (let i = 1; i <= NUM_PRODUCTS; i++) {
  const product = {
    id: i,
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    product: faker.commerce.product(),
    color: faker.color.human(),
    createdAt: faker.date.past().toISOString(),
    image: faker.image.url()
  };

  products.push(product);
}

const filePath = path.join(__dirname, "products.json");

fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
ss
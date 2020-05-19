const client = require("./client");
const faker = require("faker");

const { authenticate, compare, findUserFromToken, hash } = require("./auth");

const models = require("./modelsIndex");
const { users, products } = models;

const {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  createAddress,
  updateProductAvail,
  readAddresses,
} = require("./userMethods");

const sync = async () => {
  const sql = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS addresses;
  DROP TABLE IF EXISTS "lineItems";
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS brands;
  DROP TABLE IF EXISTS users;
  

  CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(username) > 0),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
  );
  CREATE TABLE brands(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE
  );
  CREATE TABLE products(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    description VARCHAR(999),
    price DECIMAL NOT NULL,
    avail INTEGER,
    image VARCHAR(999),
    CHECK (char_length(name) > 0)
  );
  CREATE TABLE orders(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(10) DEFAULT 'CART',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE "lineItems"(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderId" UUID REFERENCES orders(id) NOT NULL,
    "productId" UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER DEFAULT 0
  );
  CREATE TABLE addresses(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) NOT NULL,
    address VARCHAR(100) NOT NULL
  );
  `;
  await client.query(sql);

  const _users = {
    lucy: {
      username: "lucy",
      firstName: "Lucille",
      lastName: "Pincher",
      password: "LUCY",
      role: "ADMIN",
    },
    moe: {
      username: "moe",
      firstName: "Moe",
      lastName: "Durvish",
      password: "MOE",
      role: "USER",
    },
    curly: {
      username: "larry",
      firstName: "Larrold",
      lastName: "Bohannaghan",
      password: "LARRY",
      role: "USER",
    },
  };

  const _products = {
    foo: {
      name: "foo",
      brand: "doo",
      description: "I am the greatest foo in all the universe",
      price: 2,
      avail: 0,
    },
    bar: {
      name: "bar",
      brand: "doo",
      price: 2,
      avail: 10,
    },
    bazz: {
      name: "bazz",
      brand: "doo",
      price: 2.5,
      avail: 10,
    },
    quq: {
      name: "quq",
      brand: "doo",
      price: 11.99,
      avail: 10,
    },
  };

  // Get data from faker
  for (i = 0; i < 5; i++) {
    let tempName = faker.commerce.productName();
    let tempURL = faker.image.image();

    _products[tempName] = {
      name: tempName,
      brand: faker.company.companyName(),
      price: faker.commerce.price(),
      avail: Math.ceil(Math.random() * 10),
      description: faker.lorem.sentences(),
      image: tempURL,
    };
  }

  const [foo] = await Promise.all(
    Object.values(_products).map((product) => products.create(product))
  );

  const [lucy, moe, curly] = await Promise.all(
    Object.values(_users).map((user) => users.create(user))
  );

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});

  return {
    users: userMap,
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  createAddress,
  readAddresses,
  updateProductAvail,
};

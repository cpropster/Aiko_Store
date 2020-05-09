const { Client } = require("pg");

const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost/aiko_ecomm"
);

client.connect();

module.exports = client;

const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");

// create pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// create drizzle instance
const db = drizzle(pool);

// export BOTH (important)
module.exports = {
  db,
  pool
};
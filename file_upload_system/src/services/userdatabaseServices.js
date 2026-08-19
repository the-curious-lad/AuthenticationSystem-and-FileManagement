const { eq } = require("drizzle-orm");
const { db } = require("../db");
const { users } = require("../db/schema");


const findUserByEmail = async (email) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    return result[0] || null;
};

const findUserByUsername = async (username) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

    return result[0] || null;
};


const createUser = async (userData) => {
    const result = await db
        .insert(users)
        .values(userData)
        .returning();

    return result[0];
};

module.exports = {
    findUserByEmail,
    findUserByUsername,
    createUser
};
const { z } = require('zod');

const zoduser = z.object({
    email: z.email(),
    username: z.string().trim(),
    password: z.string()
        .min(8, { message: "Password can't be smaller than 8 characters." })
        .max(20, { message: "Password can't be larger than 20 characters" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" })
});


module.exports = zoduser;
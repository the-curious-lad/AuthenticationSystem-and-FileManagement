const { z } = require("zod");

const zodLoginUser = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8).max(20)
});

module.exports = zodLoginUser;

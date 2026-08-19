const {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
} = require("drizzle-orm/pg-core");

// USERS TABLE
const users = pgTable("users", {
  id: serial("id").primaryKey(),

  username: text("username").notNull(),

  email: text("email").notNull().unique(),

  password: text("password").notNull(),

  role: text("role").notNull().default("user"),

  createdAt: timestamp("created_at").defaultNow(),
});

// FILES TABLE
const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    originalName: text("original_name").notNull(),

    storedName: text("stored_name").notNull(),

    path: text("path").notNull(),

    size: integer("size"),

    mimeType: text("mime_type"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId),
  }),
);

module.exports = { users, files };

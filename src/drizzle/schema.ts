import {integer, pgEnum, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

// define enum of role
export const roleEnums = pgEnum("role_enum", ["user", "admin"]);

export const userTable = pgTable("users_table", {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    hashedPassword: text("hashed_password"),
    role: roleEnums("role").notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date()),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
})

// export const postsTable = pgTable("posts_table", {
//     id: serial("id").primaryKey(),
//     title: text("title").notNull(),
//     content: text("content").notNull(),
//     userId: integer("user_id")
//         .notNull()
//         .references(() => usersTable.id, {onDelete: "cascade"}),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at")
//         .$onUpdate(() => new Date()),
// });

// export type InsertUser = typeof usersTable.$inferInsert;
// export type SelectUser = typeof usersTable.$inferSelect;
//
// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;


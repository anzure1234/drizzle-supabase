"use server";
// import {InsertUser, SelectUser, usersTable} from "@/drizzle/schema";
// import {db} from "@/drizzle/db";
//
// export async function createUser(data: InsertUser) {
//     await db.insert(usersTable).values(data);
// }
//
// export async function getUsers(): Promise<SelectUser[]> {
//     return db.select().from(usersTable);
// }

import { db } from "@/drizzle/db";
import { ordersTable } from "@/drizzle/schema";
import { and } from "drizzle-orm/sql/expressions/conditions";
import { eq } from "drizzle-orm";

export async function saveOrder(order: {
    userId: string;
    date: string;
    mealId: number;
}) {
    await db.insert(ordersTable).values(order);
}

export async function deleteOrderByDateAndId(userId: string, date: string) {
    await db
        .delete(ordersTable)
        .where(and(eq(ordersTable.userId, userId), eq(ordersTable.date, date)));
}

export async function getAllOrders(): Promise<
    Array<typeof ordersTable.$inferSelect>
> {
    return db.select().from(ordersTable);
}

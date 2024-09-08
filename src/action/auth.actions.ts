"use server";

import {z} from "zod";
import {UserSignUpSchema} from "@/types/user-schema";
import {hash} from "argon2";
import {generateId} from "lucia";
import {db} from "@/drizzle/db";
import {userTable} from "@/drizzle/schema";
import {lucia} from "@/lib/lucia/auth";
import {cookies} from "next/headers";
import {PostgresError} from "postgres";
import {redirect} from "next/navigation";

export async function signUp(
    prevState: {
        message: string;
        user?: z.infer<typeof UserSignUpSchema>;
        issues?: string[];
    },
    formData: FormData) {

    try {
        const data = Object.fromEntries(formData);
        const parsedData = await UserSignUpSchema.safeParseAsync(data);

        if (parsedData.success) {
            console.log("User register - Server");

            const hashedPassword = await hash(parsedData.data.password);
            const userId = generateId(15);

            const result = await db.insert(userTable).values({
                id: userId,
                username: parsedData.data.username,
                hashedPassword
            }).returning({
                id: userTable.id,
                username: userTable.username,
            })

            const session = await lucia.createSession(userId, {
                expiresIn: 60 * 60 * 24 * 30,
            })

            const sessionCookie = lucia.createSessionCookie(session.id)

            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )

            // return redirect("/dashboard");
            return {
                message: "User registered successfully",
                user: {
                    id: userId,
                    username: parsedData.data.username,
                }
            }
        } else {
            return {
                message: "Invalid data",
                issues: parsedData.error.issues.map(
                    (issue: { message: any }) => issue.message
                ),
            }
        }
    } catch (error) {
        console.log(error);

        if (error && typeof error === 'object' && 'code' in error && error.code === "23505") {
            return {
                message: "Invalid data",
                issues: ["Username already exists"],
            }
        }

        return {
            message: "Invalid data",
            issues: ["Something went wrong"],
        }
    }
}


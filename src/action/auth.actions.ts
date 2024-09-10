"use server";

import {z} from "zod";
import {UserSignInSchema, UserSignUpSchema} from "@/types/user-schema";
import {hash, verify} from "argon2";
import {generateId} from "lucia";
import {db} from "@/drizzle/db";
import {userTable} from "@/drizzle/schema";
import {lucia} from "@/lib/lucia/auth";
import {cookies} from "next/headers";
import {eq} from "drizzle-orm";
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

export async function signIn(
    prevState: {
        message: string;
        user?: z.infer<typeof UserSignInSchema>;
        issues?: string[];
    },
    formData: FormData) {

    try {
        const data = Object.fromEntries(formData);
        const parsedData = await UserSignInSchema.safeParseAsync(data);

        if (parsedData.success) {
            console.log("User login - Server");

            const existingUser = await db.query.userTable.findFirst({
                where: eq(userTable.username, parsedData.data.username)
            });

            if (!existingUser) {
                return {
                    message: "Invalid data",
                    issues: ["Username or password is incorrect"],
                }
            }

            const validPassword = await verify(existingUser.hashedPassword!, parsedData.data.password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });

            if (!validPassword) {
                return {
                    message: "Invalid data",
                    issues: ["Username or password is incorrect"],
                }
            }

            const session = await lucia.createSession(existingUser.id, {
                expiresIn: 60 * 60 * 24 * 30,
            })

            const sessionCookie = lucia.createSessionCookie(session.id)

            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )

            return {
                message: "User logged in successfully",
                user: {
                    id: existingUser.id,
                    username: existingUser.username,
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

        return {
            message: "Invalid data",
            issues: ["Something went wrong"],
        }
    }
}







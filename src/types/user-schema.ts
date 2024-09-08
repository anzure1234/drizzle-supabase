import {z} from "zod";

export const UserSignUpSchema = z.object({
    username: z.string().min(6, {
        message: "Name must be at least 6 characters long"
    }).max(50, {
        message: "Name must be at most 50 characters long"
    }),

    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }).max(50, {
        message: "Password must be at most 50 characters long"
    }),

    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }).max(50, {
        message: "Password must be at most 50 characters long"
    }),
    role: z.enum(["user", "admin"]).default("user")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const UserSignInSchema = z.object({
    username: z.string().min(6).max(50),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }).max(50, {
        message: "Password must be at most 50 characters long"
    })
});

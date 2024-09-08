import {Lucia, Session, User} from "lucia";
import adapter from "@/lib/lucia/adapter";
import { cache } from "react";
import {cookies} from "next/headers";
import {roleEnums} from "@/drizzle/schema";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes : any) => {
        return {
            id: attributes.id,
            role: attributes.role,
        }
    },
})

export const validateRequest = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null
            };
        }

        const result = await lucia.validateSession(sessionId);
        // next.js throws when you attempt to set cookie when rendering page
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
        } catch {
            // Next.js throws error when attempting to set cookies when rendering page

        }
        return result;
    }
);

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            id: string;
            role: (typeof roleEnums.enumValues)[number];
        };
    }
}


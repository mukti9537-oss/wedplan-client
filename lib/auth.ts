import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BUTTER_AUTH_DB_URL as string);
const db = client.db('wedplan');

// ---------------------------------------------------------------------------
// Trusted origins (CSRF protection)
// ---------------------------------------------------------------------------
// Better Auth rejects any sign-in/sign-up request whose Origin header does not
// match the configured base URL. On Vercel the deployment URL is provided
// automatically, so the live site keeps working even when BETTER_AUTH_URL is
// missing or still points at localhost.
const appUrl =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000";

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "";

const vercelPreviewUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

const trustedOrigins = [
    appUrl,
    vercelProductionUrl,
    vercelPreviewUrl,
    process.env.NEXT_PUBLIC_SITE_URL,
    // Explicit production deployment
    "https://wedplan-client-eosin.vercel.app",
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({

    // The WedPlan API verifies session tokens sent as
    // `Authorization: Bearer <session token>` headers. Without this plugin
    // better-auth only reads the token from cookies.
    plugins: [bearer()],

    // Origins allowed to call the auth endpoints (CSRF / origin check)
    trustedOrigins,

    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "customer",
                input: true,
            },
            // Set server-side when an admin blocks the account.
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
            premium: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    // Security: admin accounts can never be created through public
    // registration - any non vendor role is forced back to "customer".
    // Role, block status and subscription can never be changed by the client.
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const requestedRole = (user as Record<string, unknown>).role;
                    const role = requestedRole === "vendor" ? "vendor" : "customer";
                    return { data: { ...user, role, isBlocked: false, premium: false } };
                },
            },
            update: {
                before: async (user) => {
                    const data = { ...user } as Record<string, unknown>;
                    delete data.role;
                    delete data.isBlocked;
                    delete data.premium;
                    return { data };
                },
            },
        },
        session: {
            create: {
                before: async (session) => {
                    try {
                        const userId = String(
                            (session as Record<string, unknown>).userId || ""
                        );
                        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
                            const blockedUser = await db
                                .collection("user")
                                .findOne({ _id: new ObjectId(userId) });
                            if (blockedUser?.isBlocked) {
                                // Blocked accounts must not get a new session
                                return false;
                            }
                        }
                    } catch {
                        // Fail open only on lookup errors - block enforcement
                        // still happens in requireRole and on the API server.
                    }
                    return;
                },
            },
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});

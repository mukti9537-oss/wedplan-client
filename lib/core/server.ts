import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// In-memory cache so we do not exchange a JWT on every single request.
const jwtCache = new Map<string, { token: string; expires: number }>();

export const getSession = async () => {
    "use server";
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        return session ?? null
    } catch (error) {
        // Never let a session lookup crash a server render (#441).
        console.error("Failed to read session:", error);
        return null;
    }
}

/**
 * Exchanges the Better Auth session token for a short-lived JWT issued by the
 * backend (/auth/token). Falls back to the session token when the exchange is
 * not possible - the backend accepts both.
 */
export const getAccessToken = async (): Promise<string> => {
    "use server";
    const session = await getSession();
    const sessionToken = session?.session?.token;

    if (!sessionToken) {
        redirect("/sign-in")
    }

    const cached = jwtCache.get(sessionToken);
    if (cached && cached.expires > Date.now()) {
        return cached.token;
    }

    try {
        const res = await fetch(`${BASE_URL}/auth/token`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
            cache: "no-store",
        });

        if (res.ok) {
            const data = await res.json();
            if (data?.token) {
                const expiresInMs = (data.expiresIn || 3600) * 1000;
                jwtCache.set(sessionToken, {
                    token: data.token,
                    expires: Date.now() + expiresInMs - 60_000,
                });
                return data.token;
            }
        }
    } catch (error) {
        console.error("JWT exchange failed, falling back to session token:", error);
    }

    return sessionToken;
}

export const getToken = async() => {
    const session = await getSession();
    if(!session || !session.session?.token) {
        redirect("/sign-in")
    }
    return session.session.token;
}

export const authFetch = async(api: string, init: RequestInit = {}) => {
    const token = await getAccessToken();
    const res = await fetch(api, {
        ...init,
        headers: {
            ...(init.headers || {}),
            authorization: `Bearer ${token}`
        },
        cache: "no-store",
    })
    return res;
}

/**
 * Server-side role guard for dashboard layouts.
 * - Unauthenticated users are redirected to Sign In (with a callback).
 * - Blocked users and cross-role access are redirected to /unauthorized.
 */
export const requireRole = async (role: string) => {
    const session = await getSession()

    if (!session) {
        redirect(`/sign-in?callbackURL=${encodeURIComponent(`/dashboard/${role}`)}`)
    }

    if (session.user.isBlocked) {
        redirect("/unauthorized")
    }

    if (session.user.role !== role) {
        redirect("/unauthorized")
    }

    return session;
}

/**
 * Builds the Authorization header for calls to the WedPlan API from the
 * browser. Sends the Better Auth session token as a Bearer token - the API
 * verifies it server-side (and issues JWTs through /auth/token).
 *
 * The auth client is imported lazily so this helper is also safe to import
 * from modules that are rendered on the server.
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
        const { authClient } = await import("@/lib/auth-client");
        const res = await authClient.getSession();
        const token = res?.data?.session?.token;

        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
    } catch (error) {
        console.error("Failed to read session token:", error);
    }

    return {};
};

import { getAccessToken } from "@/lib/core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Runs on the server (payment success page) with the logged-in session.
export const checkoutVerify = async (sessionId: string) => {
    const token = await getAccessToken();

    const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
        cache: 'no-store',
    });
    return response.json();
};

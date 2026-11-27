import { getAuthHeaders } from "@/lib/core/auth-headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getPremiumById = async (userId: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/premium`, { headers });
    return res.json();
};

export const getTransactions = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/transactions`, { headers });

    if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.message || "Failed to fetch transactions");
    }

    return res.json();
};

import { getAuthHeaders } from "@/lib/core/auth-headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getService = async () => {
    const res = await fetch(`${BASE_URL}/add-service`, { cache: "no-store" })
    return res.json();
};

export const deleteService = async (serviceId: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "DELETE",
        headers,
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(result?.message || "Failed to delete service");
    }

    return result;
};

export const updateService = async (serviceId: string, data: { isAvailable: boolean }) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(result?.message || "Failed to update service");
    }

    return result;
};

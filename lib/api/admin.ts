import { getAuthHeaders } from "@/lib/core/auth-headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const blockUser = async (userId: string, isBlocked: boolean) => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/users/${userId}/block`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
        },
        body: JSON.stringify({ isBlocked }),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(result?.message || "Failed to update user status");
    }

    return result;
};

export const approveRejectService = async (serviceId: string, status: "Approved" | "Rejected") => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
        },
        body: JSON.stringify({ status }),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(result?.message || "Failed to update service status");
    }

    return result;
};

export const deleteServiceAdmin = async (serviceId: string) => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "DELETE",
        headers: authHeaders,
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(result?.message || "Failed to delete service");
    }

    return result;
};

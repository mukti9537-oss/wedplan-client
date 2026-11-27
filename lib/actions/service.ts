import { getAuthHeaders } from "@/lib/core/auth-headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getService = async (query = "") => {
    let res: Response;

    try {
        res = await fetch(`${BASE_URL}/add-service?${query}`, {
            cache: "no-store",
        });
    } catch {
        throw new Error(
            `Unable to reach the WedPlan API at ${BASE_URL}. Please make sure the server is running.`
        );
    }

    if (!res.ok) {
        throw new Error(`Failed to load services (HTTP ${res.status})`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        throw new Error("The WedPlan API returned an unexpected response.");
    }

    return res.json();
};

export const createService = async (data: FormData) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/add-service`, {
        method: "POST",
        headers,
        body: data,
    });
    let result;
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        result = await res.json();
    } else {
        const text = await res.text();
        result = { message: text || `Server error (${res.status})` };
    }
    if (!res.ok) {
        throw new Error(result.message || "Failed to add service");
    }
    return result;
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
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.message || "Failed to update service");
    }
    return res.json();
};

// Full service details update (used by the edit-service page)
export const updateServiceDetails = async (
    serviceId: string,
    data: {
        serviceName: string;
        category: string;
        description: string;
        price: number;
        location: string;
    }
) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(result?.message || "Failed to update service");
    }
    return result;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getService = async (query = "") => {
    const res = await fetch(`${BASE_URL}/add-service?${query}`);
    return res.json();
};

export const createService = async (data: FormData) => {
    const res = await fetch(`${BASE_URL}/add-service`, {
        method: "POST",
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
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, { method: "DELETE" });
    return res.json();
};

export const updateService = async (serviceId: string, data: { isAvailable: boolean }) => {
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Failed to update service");
    }
    return res.json();
};
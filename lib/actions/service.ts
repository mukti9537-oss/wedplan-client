const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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
// Get Services
export const getService = async () => {
    const res = await fetch(`${BASE_URL}/add-service`);

    if (!res.ok) {
        throw new Error("Failed to fetch services");
    }

    return res.json();
};
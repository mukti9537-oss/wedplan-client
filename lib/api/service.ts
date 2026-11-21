const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getService = async () => {
    const res = await fetch(`${BASE_URL}/add-service`)
    return res.json();
};
export const deleteService = async (serviceId: string) => {
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "DELETE",
    });

    return res.json();
};
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const blockUser = async (userId: string, isBlocked: boolean) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/block`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked }),
    });

    if (!res.ok) {
        throw new Error("Failed to update user status");
    }

    return res.json();
};

export const approveRejectService = async (serviceId: string, status: "Approved" | "Rejected") => {
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        throw new Error("Failed to update service status");
    }

    return res.json();
};

export const deleteServiceAdmin = async (serviceId: string) => {
    const res = await fetch(`${BASE_URL}/add-service/${serviceId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete service");
    }

    return res.json();
};

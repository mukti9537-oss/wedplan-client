const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type ApplicationRow = {
    _id?: string;
    bookingId?: string;
    customerId?: string;
    email?: string;
    serviceName?: string;
    serviceImage?: string;
    vendorName?: string;
    vendorEmail?: string;
    eventDate?: string;
    eventLocation?: string;
    status?: string;
    requestDate?: string | Date;
    BookingDate?: string;
    BookingLocation?: string;
    AdditionalMessage?: string;
    createdAt?: string | Date;
};

type ApplicationFormData = {
    bookingId: string;
    customerId: string;
    email: string;
    BookingDate: string;
    BookingLocation: string;
    AdditionalMessage?: string;
};

export const getApplications = async(query = ""): Promise<ApplicationRow[]> => {
    const res = await fetch(`${BASE_URL}/bookingsrequest?${query}`);
    if (!res.ok) {
        throw new Error("Failed to fetch applications");
    }
    return res.json();
}

export const createApplication = async (data: ApplicationFormData) => {
    const response = await fetch(`${BASE_URL}/bookingsrequest`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    return response.json()
}
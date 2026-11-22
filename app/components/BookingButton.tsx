"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const BookingButton = ({ serviceId }: { serviceId: string }) => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleBooking = () => {
        if (!session) {
            router.push(`/sign-in?callbackURL=${encodeURIComponent(`/bookingform/${serviceId}`)} `)
            return;
        }

        router.push(`/bookingform/${serviceId}`);
    };

    return (
        <button
            onClick={handleBooking}
            disabled={isPending}
            className="block text-center w-full bg-[#8c1010] hover:bg-[#681010] text-white font-semibold py-4 rounded-lg transition duration-300 disabled:opacity-50"
        >
            {isPending ? "Checking..." : "Request Booking →"}
        </button>
    );
};

export default BookingButton;
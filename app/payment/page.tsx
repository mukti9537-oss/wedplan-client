import { Suspense } from "react";
import PaymentContent from "./payment-content";

export const dynamic = "force-dynamic";

const PaymentPage = () => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center">
                    <p className="text-sm text-[#843047]">Loading payment status...</p>
                </div>
            }
        >
            <PaymentContent />
        </Suspense>
    );
};

export default PaymentPage;

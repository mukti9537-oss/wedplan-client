import Link from "next/link";
import { ShieldAlert, Heart, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fffaf7] px-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fce8e6] flex items-center justify-center mb-6">
                <ShieldAlert size={30} className="text-[#800000]" />
            </div>

            <h1 className="text-3xl font-serif font-bold text-[#4b1727] mb-3">
                Access Denied
            </h1>

            <p className="text-[#8c7479] mb-8 max-w-md">
                You are not allowed to view this page. Your account may be
                blocked, or you may not have the required permissions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                    href="/sign-in"
                    className="bg-[#800000] hover:bg-[#7C0A09] text-white px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center gap-2"
                >
                    <LogIn size={18} />
                    Sign In
                </Link>

                <Link
                    href="/"
                    className="border border-[#800000] text-[#800000] hover:bg-[#fff1f1] px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center gap-2"
                >
                    <Heart size={18} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

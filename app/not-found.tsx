import Link from "next/link";
import { Heart, Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fffaf7] px-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fce8e6] flex items-center justify-center mb-6">
                <Compass size={30} className="text-[#800000]" />
            </div>

            <h1 className="text-5xl font-serif font-bold text-[#4b1727] mb-3">
                404
            </h1>

            <h2 className="text-2xl font-serif font-bold text-[#4b1727] mb-3">
                Page Not Found
            </h2>

            <p className="text-[#8c7479] mb-8 max-w-md">
                The page you are looking for doesn&apos;t exist or has been
                moved. Let&apos;s get you back to planning the perfect wedding.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                    href="/"
                    className="bg-[#800000] hover:bg-[#7C0A09] text-white px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center gap-2"
                >
                    <Heart size={18} />
                    Back to Home
                </Link>

                <Link
                    href="/browse-services"
                    className="border border-[#800000] text-[#800000] hover:bg-[#fff1f1] px-6 py-3 rounded-lg font-semibold transition duration-300"
                >
                    Browse Services
                </Link>
            </div>
        </div>
    );
}

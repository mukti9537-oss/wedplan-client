import { Heart } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fffaf7] px-5 text-center">
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[#fce8e6] flex items-center justify-center">
                    <Heart
                        size={28}
                        className="text-[#800000] animate-pulse"
                        fill="currentColor"
                    />
                </div>

                <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#800000] animate-spin" />
            </div>

            <h2 className="text-xl font-serif font-bold text-[#4b1727] mb-2">
                Loading...
            </h2>

            <p className="text-sm text-[#8c7479]">
                Preparing everything for your special day
            </p>
        </div>
    );
}

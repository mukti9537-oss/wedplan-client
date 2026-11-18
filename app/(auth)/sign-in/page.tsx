"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import {
    Heart,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";

import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

const SignInPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Credential Login
    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                return;
            }

            if (data) {
                toast.success("Welcome back! Login successful.");

                router.replace("/");
                router.refresh();
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    // Google Login
    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);

            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Google login failed.");
                setGoogleLoading(false);
            }
        } catch (error) {
            console.error(error);

            toast.error("Google authentication failed.");
            setGoogleLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#fff8f5] px-4 py-12">

            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#8b1010]/5 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#8b1010]/5 blur-3xl" />
            </div>

            {/* Sign In Card */}
            <div className="relative z-10 w-full max-w-[450] rounded-2xl border border-[#eadcda] bg-white px-6 py-10 shadow-xl sm:px-10">

                {/* Logo */}
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center gap-2"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b1010]">
                        <Heart
                            size={20}
                            fill="white"
                            className="text-white"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[#8b1010]">
                            WedPlan
                        </h2>

                        <p className="text-[9px] font-medium tracking-[0.2em] text-[#927c7c]">
                            WEDDING PLANNING PLATFORM
                        </p>
                    </div>
                </Link>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-3xl font-bold text-[#4b1e2e] sm:text-4xl">
                        Welcome Back!
                    </h1>

                    <p className="mt-2 text-sm text-[#806b6d]">
                        Sign in to continue your wedding journey.
                    </p>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSignIn} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#4b1e2e]">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#a38c8c]"
                            />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 w-full rounded-lg border border-[#e5d9d7] bg-white pr-4 pl-11 text-sm text-[#4b1e2e] outline-none transition focus:border-[#8b1010] focus:ring-2 focus:ring-[#8b1010]/10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#4b1e2e]">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#a38c8c]"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 w-full rounded-lg border border-[#e5d9d7] bg-white pr-12 pl-11 text-sm text-[#4b1e2e] outline-none transition focus:border-[#8b1010] focus:ring-2 focus:ring-[#8b1010]/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#a38c8c] transition hover:text-[#8b1010]"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8b1010] text-sm font-semibold text-white transition duration-300 hover:bg-[#6f0c0c] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                </form>

                {/* Divider */}
                <div className="my-7 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#e5d9d7]" />

                    <span className="text-xs text-[#927c7c]">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-[#e5d9d7]" />
                </div>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#d9cccc] bg-white text-sm font-semibold text-[#4b1e2e] transition hover:bg-[#fff8f5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {googleLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <FcGoogle className="text-lg" />
                            Sign in with Google
                        </>
                    )}
                </button>

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-sm text-[#806b6d]">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-[#8b1010] transition hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

            </div>
        </main>
    );
};

export default SignInPage;

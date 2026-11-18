"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import {
    Heart,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Camera,
    Loader2,
} from "lucide-react";

import { toast } from "react-toastify";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("couple");

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Profile Image Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        setProfileImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // Password Validation
    const validatePassword = () => {
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain an uppercase letter.");
            return false;
        }

        if (!/[a-z]/.test(password)) {
            toast.error("Password must contain a lowercase letter.");
            return false;
        }

        return true;
    };

    // Upload Image to ImgBB
    const uploadImage = async () => {
        if (!profileImage) return undefined;

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            throw new Error("ImgBB API key is missing.");
        }

        const formData = new FormData();
        formData.append("image", profileImage);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("Image upload failed.");
        }

        return result.data.url;
    };

    // Email & Password Registration
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
 
        e.preventDefault();

        if (!validatePassword()) return;

        setLoading(true);

        try {
            let imageUrl: string | undefined;

            if (profileImage) {
                imageUrl = await uploadImage();
            }

            const { data, error } = await authClient.signUp.email({
                name: fullName,
                email,
                password,
                image: imageUrl,
            });

            if (error) {
                toast.error(error.message || "Registration failed.");
                return;
            }

            if (data) {
                toast.success("Account created successfully!");

                router.replace("/");
                router.refresh();
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    // Google Authentication
    const handleGoogleSignUp = async () => {
        try {
            setGoogleLoading(true);

            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Google signup failed.");
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

            {/* Sign Up Card */}
            <div className="relative z-10 w-full max-w-[480] rounded-2xl border border-[#eadcda] bg-white px-6 py-9 shadow-xl sm:px-10 sm:py-10">

                {/* Logo */}
                <Link
                    href="/"
                    className="mb-7 flex items-center justify-center gap-2"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b1010]">
                        <Heart size={20} fill="white" className="text-white" />
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
                <div className="mb-7 text-center">
                    <h1 className="font-serif text-3xl font-bold text-[#4b1e2e] sm:text-4xl">
                        Welcome!
                    </h1>

                    <p className="mt-2 text-sm font-medium text-[#806b6d]">
                        Create your WedPlan account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#4b1e2e]">
                            Full Name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#a38c8c]"
                            />

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="h-12 w-full rounded-lg border border-[#e5d9d7] bg-white pr-4 pl-11 text-sm text-[#4b1e2e] outline-none transition focus:border-[#8b1010] focus:ring-2 focus:ring-[#8b1010]/10"
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 w-full rounded-lg border border-[#e5d9d7] bg-white pr-12 pl-11 text-sm text-[#4b1e2e] outline-none transition focus:border-[#8b1010] focus:ring-2 focus:ring-[#8b1010]/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#a38c8c] hover:text-[#8b1010]"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-[#927c7c]">
                            Minimum 6 characters, one uppercase and one lowercase letter.
                        </p>
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#4b1e2e]">
                            Profile Image{" "}
                            <span className="text-xs font-normal text-[#a38c8c]">
                                (Optional)
                            </span>
                        </label>

                        <div className="flex items-center gap-4 rounded-lg border border-dashed border-[#d9c3c3] bg-[#fffaf8] p-3">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1e4e1]">
                                {preview ? (
                                    <Image
                                        width={15}
                                        height={15}
                                        src={preview}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Camera size={21} className="text-[#8b1010]" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <label
                                    htmlFor="profileImage"
                                    className="inline-block cursor-pointer rounded-md bg-[#f0e2df] px-4 py-2 text-xs font-semibold text-[#8b1010] transition hover:bg-[#e8d1cd]"
                                >
                                    Choose Image
                                </label>

                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                <p className="mt-1 truncate text-xs text-[#927c7c]">
                                    {profileImage ? profileImage.name : "JPG, PNG or WEBP"}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Account Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#4b1e2e]">
                            Account Role
                        </label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-12 w-full rounded-lg border border-[#e5d9d7] bg-white px-4 text-sm text-[#4b1e2e] outline-none transition focus:border-[#8b1010] focus:ring-2 focus:ring-[#8b1010]/10"
                        >
                            <option value="vendor">Vendor</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8b1010] text-sm font-semibold text-white transition duration-300 hover:bg-[#6f0c0c] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#e5d9d7]" />

                    <span className="text-xs text-[#927c7c]">OR</span>

                    <div className="h-px flex-1 bg-[#e5d9d7]" />
                </div>

                {/* Google Signup */}
                <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading || googleLoading}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#d9cccc] bg-white text-sm font-semibold text-[#4b1e2e] transition hover:bg-[#fff8f5] disabled:opacity-60"
                >
                    {googleLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <FcGoogle className="text-lg" />
                            Sign up with Google
                        </>
                    )}
                </button>

                {/* Sign In Link */}
                <p className="mt-7 text-center text-sm text-[#806b6d]">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-semibold text-[#8b1010] hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

            </div>
        </main>
    );
};

export default SignUpPage;
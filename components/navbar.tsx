"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Heart,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerBackdrop,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  DrawerPortal,
} from "@/components/ui/drawer";

import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const profileRef = React.useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const user = session?.user;
  const role = user?.role || "customer";

  const navigation = [
    { href: "/", label: "Home" },
    { href: "/browse-services", label: "Browse Services" },
    { href: `/dashboard/${role}`, label: "Dashboard" },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "bg-[#FAF0F0]/95 backdrop-blur-md",
          "border-b border-[#EADDDD]",
          "transition-all duration-300"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 lg:px-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C0A09] transition-transform duration-300 group-hover:scale-105">
              <Heart className="h-5 w-5 fill-white text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#7C0A09]">
                WedPlan
              </span>

              <span className="text-[9px] font-medium tracking-[2px] text-[#766766] uppercase">
                Wedding Planning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">

            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-[13px] font-medium",
                  "text-[#3D2928]",
                  "transition-colors duration-200",
                  "hover:text-[#7C0A09]",
                  "after:absolute after:-bottom-1 after:left-0",
                  "after:h-[1.5px] after:w-0",
                  "after:bg-[#7C0A09]",
                  "after:transition-all after:duration-300",
                  "hover:after:w-full"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>

                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 rounded-full px-3 py-2 transition-all hover:bg-[#7C0A09]/5"
                >
                  {user.image ? (
                    <Image
                      width={10}
                      height={10}
                      src={user.image}
                      alt={user.name}
                      unoptimized
                      className="h-9 w-9 rounded-full object-cover border-2 border-[#EADDDD]"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C0A09] text-white">
                      <UserRound size={19} />
                    </div>
                  )}

                  <span className="text-sm font-semibold text-[#7C0A09]">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[#7C0A09] transition-transform",
                      isProfileOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-[#EADDDD] bg-white shadow-xl">

                    {/* User Information */}
                    <div className="flex items-center gap-3 border-b border-[#EADDDD] bg-[#FAF0F0] p-4">

                      {user.image ? (
                        <Image
                          width={10}
                          height={10}
                          src={user.image}
                          alt={user.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7C0A09] text-white">
                          <UserRound size={21} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#3D2928]">
                          {user.name}
                        </h3>

                        <p className="truncate text-xs text-[#766766]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">

                      <Link
                        href={`/dashboard/${role}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#3D2928] transition-colors hover:bg-[#FAF0F0] hover:text-[#7C0A09]"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile-settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#3D2928] transition-colors hover:bg-[#FAF0F0] hover:text-[#7C0A09]"
                      >
                        <Settings size={18} />
                        Profile Settings
                      </Link>

                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#EADDDD] p-2">

                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>

                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-[13px] font-semibold text-[#3D2928] transition-colors hover:text-[#7C0A09]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#7C0A09] px-6 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#5F0808] hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#7C0A09] transition-colors hover:bg-[#7C0A09]/10"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        open={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      >
        <DrawerPortal>
          <DrawerBackdrop className="bg-black/40" />

          <DrawerContent className="border-t border-[#EADDDD] bg-[#FAF0F0] p-6">

            {/* Drawer Header */}
            <div className="mb-8 flex items-center justify-between">

              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C0A09]">
                  <Heart className="h-5 w-5 fill-white text-white" />
                </div>

                <span className="text-xl font-bold text-[#7C0A09]">
                  WedPlan
                </span>
              </Link>

              <DrawerClose className="flex h-9 w-9 items-center justify-center rounded-full text-[#7C0A09] hover:bg-[#7C0A09]/10">
                <X className="h-5 w-5" />
              </DrawerClose>
            </div>

            <DrawerTitle className="sr-only">
              Navigation Menu
            </DrawerTitle>

            <DrawerDescription className="mb-7 text-sm leading-relaxed text-[#766766]">
              Discover meaningful connections and plan your perfect future.
            </DrawerDescription>

            {/* Mobile User Profile */}
            {user && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#EADDDD] bg-white p-4">

                {user.image ? (
                  <Image
                    width={10}
                    height={10}
                    src={user.image}
                    alt={user.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7C0A09] text-white">
                    <UserRound size={20} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#3D2928]">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-[#766766]">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="grid gap-2">

              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3.5 text-sm font-semibold text-[#3D2928] transition-colors hover:bg-[#7C0A09]/10 hover:text-[#7C0A09]"
                >
                  {item.label}
                </Link>
              ))}

            </nav>

            {/* Mobile Auth Buttons */}
            <div className="mt-7 space-y-3 border-t border-[#EADDDD] pt-6">

              {user ? (
                <>
                  <Link
                    href="/profile-settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-[#3D2928] hover:bg-[#7C0A09]/10"
                  >
                    <Settings size={18} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-full bg-[#7C0A09] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5F0808]"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full border border-[#7C0A09] py-3 text-sm font-semibold text-[#7C0A09] hover:bg-[#7C0A09]/5"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-[#7C0A09] py-3 text-sm font-semibold text-white hover:bg-[#5F0808]"
                  >
                    Sign Up
                  </Link>
                </>
              )}

            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}
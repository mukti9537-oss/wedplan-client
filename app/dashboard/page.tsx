import { getSession } from "@/lib/core/server";
import { redirect } from "next/navigation";

/**
 * /dashboard is the post-login landing target (used as the Google OAuth
 * callback URL). It redirects the authenticated user to the dashboard that
 * matches their role, and unauthenticated users to Sign In.
 */
export default async function DashboardIndexPage() {
    const session = await getSession();

    if (!session) {
        redirect("/sign-in?callbackURL=%2Fdashboard");
    }

    if (session.user.isBlocked) {
        redirect("/unauthorized");
    }

    const role = session.user.role || "customer";
    redirect(`/dashboard/${role}`);
}

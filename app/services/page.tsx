import { redirect } from "next/navigation";

/**
 * /services is an alias for Browse Services (required route).
 */
export default function ServicesIndexPage() {
    redirect("/browse-services");
}

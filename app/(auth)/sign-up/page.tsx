import { Suspense } from "react";
import SignUpContent from "./sign-up-content";

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpContent />
        </Suspense>
    );
}

import SignUpPage from "@/components/signup-form";
import {validateRequest} from "@/lib/lucia/auth";
import {redirect} from "next/navigation";

export default async function SignPage() {

    const {user} = await validateRequest();


    if (user?.role === "admin") {
        return (
            <div>
                <SignUpPage/>
            </div>
        )
    }

    return redirect("/signin?error=not-admin");
}

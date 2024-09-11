import {validateRequest} from "@/lib/lucia/auth";
import {redirect} from "next/navigation";
import {signOut} from "@/action/auth.actions";
import {Button} from "@/components/ui/button";

export default async function Home() {

    const {user} = await validateRequest();

    if (!user) {
        return redirect("/signin");
    }


    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex w-full flex-col items-center justify-center px-6 py-10 text-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900">
                    Drizzle Supabase
                </h1>
                <p>User ID: {user.id}</p>
                <form action={signOut}>
                    <Button type="submit">Sign Out</Button>
                </form>

            </main>
        </div>
    );
}

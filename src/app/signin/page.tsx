"use client";

import {UserSignUpSchema} from "@/types/user-schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect, useRef} from "react";
import {useFormState} from "react-dom";
import {signIn, tet} from "@/action/auth.actions";
import {useToast} from "@/hooks/use-toast";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {

    const form = useForm<z.infer<typeof UserSignUpSchema>>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    const formRef = useRef<HTMLFormElement>(null);

    const [state, signInAction] = useFormState(signIn as any, {
        message: "",
        user: null,
        issues: [],
    })

    const {toast} = useToast();

    useEffect(() => {
        if (state?.user) {
            console.log("State user", state.user)
            toast({
                title: "User Logged In",
                description: "The user has been logged in successfully!",
            })

            return redirect("/");
        } else if (state?.message && !state?.user) {
            toast({
                title: "Login Failed",
                description: state.message,
                variant: "destructive",
            })
        } else if (state?.issues && state.issues.length > 0) {
            toast({
                title: "User Login Failed",
                description: state.issues.join("\n"),
                variant: "destructive",
            })
        }
    }, [state, toast])

    return (
        <Card className="w-[350px] mx-auto mt-8">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={signInAction}
                      className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            {...form.register("username")}
                            placeholder="Enter your username"
                        />
                        {form.formState.errors.username && (
                            <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...form.register("password")}
                            placeholder="Enter your password"
                        />
                        {form.formState.errors.password && (
                            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    {state.issues && state.issues.length > 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                <ul className="list-disc pl-4">
                                    {state.issues.map((issue, index) => (
                                        <li key={index}>{issue}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <Button className="w-full">
                        {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Don't have an account? <Link href={"/signup"}>Sign Up</Link>
                </p>
            </CardFooter>
        </Card>
    )
}

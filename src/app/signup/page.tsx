'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserSignUpSchema } from "@/types/user-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "@/action/auth.actions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { Toaster } from "@/components/ui/toaster"
import {useToast} from "@/hooks/use-toast";

export default function SignUpPage() {
    const form = useForm<z.infer<typeof UserSignUpSchema>>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            role: "user",
        },
    })

    const formRef = useRef<HTMLFormElement>(null)

    const [state, signUpAction] = useFormState(signUp as any, {
        message: "",
        user: null,
        issues: [],
    })

    const { toast } = useToast()

    useEffect(() => {
        if (state?.user) {
            console.log("State user", state.user)
            toast({
                title: "User Registered",
                description: "The user has been registered successfully.",
            })
        } else if (state?.message && !state?.user) {
            toast({
                title: "Registration Failed",
                description: state.message,
                variant: "destructive",
            })
        } else if (state?.issues && state.issues.length > 0) {
            toast({
                title: "User Registration Failed",
                description: state.issues.join("\n"),
                variant: "destructive",
            })
        }
    }, [state, toast])

    return (
        <>
            <Form {...form}>
                <form
                    action={signUpAction}
                    onSubmit={form.handleSubmit(() => formRef.current?.submit())}
                    ref={formRef}
                    className="space-y-8 w-full max-w-md mx-auto p-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your username" {...field} className="w-full" />
                                </FormControl>
                                <FormDescription className="text-sm">
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm your password" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>
            <Toaster />
        </>
    )
}

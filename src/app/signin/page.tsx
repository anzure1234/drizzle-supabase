"use client";

import {UserSignUpSchema} from "@/types/user-schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useRef} from "react";
import {useFormState} from "react-dom";
import {signIn} from "@/action/auth.actions";
import {useToast} from "@/hooks/use-toast";

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
        issues: [],
    })

    const {toast} = useToast();


    return (
        <>
            <h1>Sign In</h1>
        </>
    )
}

import {useForm} from "react-hook-form";
import {z} from "zod";
import {UserSignUpSchema} from "@/types/user-schema";
import {zodResolver} from "@hookform/resolvers/zod";

export default function SignUpForm() {

    const userForm = useForm<z.infer<typeof UserSignUpSchema>>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: {
            
        }
    })
};

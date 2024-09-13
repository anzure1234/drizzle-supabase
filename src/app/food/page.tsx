import FoodOrder from "@/app/food/food-order";
import {validateRequest} from "@/lib/lucia/auth";
import {redirect} from "next/navigation";

export default async function FoodOrderPage() {
    const {user} = await validateRequest();

    if (!user) {
        return redirect("/signin");
    }

    return (
        <div>
            <FoodOrder/>
            <h1>Food Order Page</h1>
        </div>)

}

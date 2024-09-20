import { getAllOrders } from "@/drizzle/actions";
import { useQuery } from "@tanstack/react-query";

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await getAllOrders();
            return response;
        },
    });
}

import {getAllOrdersById} from "@/drizzle/actions";
import {useQuery} from "@tanstack/react-query";

export function useOrders(userId: string) {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await getAllOrdersById(userId);
            return response;
        },
    });
}

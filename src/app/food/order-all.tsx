"use client";

import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";

export default function OrderAll() {
    const { data, error, isLoading } = useOrders();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;

    return (
        <div>
            <h1>Order All</h1>
            <Button>Fetch</Button>
            {data?.map((order) => (
                <div key={order.id}>
                    <h2>The order date is: {order.date}</h2>
                    <p>The meal Id: {order.mealId}</p>
                </div>
            ))}
        </div>
    );
}

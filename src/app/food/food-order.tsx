"use client";

import React, { useEffect, useState } from "react";
import {
    addDays,
    eachDayOfInterval,
    format,
    isAfter,
    isBefore,
    isSameDay,
    isWeekend,
    set,
    startOfWeek,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteOrderByDateAndId, saveOrder } from "@/drizzle/actions";
import { User } from "lucia";

interface FoodOrderProps {
    user: User;
}

// const FoodOrder: React.FC<FoodOrderProps> = ({ user }) => {
//     // component logic
// };

export default function FoodOrder({ user }: FoodOrderProps) {
    const [orders, setOrders] = useState<
        Map<string, { id: number; name: string }>
    >(new Map());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [orderData, setOrderData] = useState<
        Array<{ userId: string; date: string; mealId: number }>
    >([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const meals = [
        {
            id: 1,
            name: "Grilled Chicken Salad",
            description: "Fresh greens with grilled chicken breast",
        },
        // {id: 2, name: "Vegetarian Pasta", description: "Penne pasta with mixed vegetables in tomato sauce"},
        // {id: 3, name: "Fish and Chips", description: "Crispy battered fish with golden fries"},
    ];

    const currentWeekStart = startOfWeek(currentTime, { weekStartsOn: 1 });
    const nextWeekStart = addDays(currentWeekStart, 7);
    const daysToDisplay = eachDayOfInterval({
        start: currentWeekStart,
        end: addDays(nextWeekStart, 6),
    });

    const isOrderable = (date: Date) => {
        const orderCutoffTime = set(addDays(date, -1), {
            hours: 21,
            minutes: 0,
            seconds: 0,
        });
        return (
            isAfter(date, currentTime) &&
            !isWeekend(date) &&
            isBefore(currentTime, orderCutoffTime)
        );
    };

    const handleDateClick = (date: Date) => {
        if (isOrderable(date)) {
            const dateString = format(date, "yyyy-MM-dd");
            if (orders.has(dateString)) {
                setSelectedDate(date);
                setIsCancelDialogOpen(true);
            } else {
                setSelectedDate(date);
                setIsMealDialogOpen(true);
            }
        }
    };

    const handleOrderClick = async (meal: { id: number; name: string }) => {
        if (selectedDate) {
            const dateString = format(selectedDate, "yyyy-MM-dd");
            setOrders(new Map(orders.set(dateString, meal)));

            // Save order data
            const userId = user?.id;
            const newOrder = {
                userId,
                date: dateString,
                mealId: meal.id,
                isEat: true,
            };
            console.log("userId", userId);

            const newOrderData = [...orderData, newOrder];

            setOrderData(newOrderData);

            // Save order to database
            console.log(orderData);
            await saveOrder(newOrder);
        }
        setIsMealDialogOpen(false);
    };

    const handleCancelOrder = async () => {
        if (selectedDate) {
            const dateString = format(selectedDate, "yyyy-MM-dd");
            const newOrders = new Map(orders);
            newOrders.delete(dateString);
            setOrders(newOrders);

            // Remove order data
            // const userId = "rfpce5licpx96jx" // Replace with actual user ID
            // const { user} = await validateRequest();
            const userId = user?.id;

            setOrderData(
                orderData.filter(
                    (order) =>
                        order.date !== dateString || order.userId !== userId
                )
            );
            // save to database
            await deleteOrderByDateAndId(userId, dateString);
        }
        setIsCancelDialogOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold">TechCorp Food Ordering</h1>
                <p className="text-xl">
                    Current Week: {format(currentWeekStart, "MMMM d")} -{" "}
                    {format(addDays(currentWeekStart, 6), "MMMM d, yyyy")}
                </p>
                <p className="text-xl">
                    Next Week: {format(nextWeekStart, "MMMM d")} -{" "}
                    {format(addDays(nextWeekStart, 6), "MMMM d, yyyy")}
                </p>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 mb-8">
                {daysToDisplay.map((date, index) => {
                    const dateString = format(date, "yyyy-MM-dd");
                    const isToday = isSameDay(date, currentTime);
                    const isOrdered = orders.has(dateString);
                    const canOrder = isOrderable(date);
                    const isCurrentWeek = isBefore(date, nextWeekStart);

                    return (
                        <div key={index} className="relative">
                            <Button
                                variant={isOrdered ? "default" : "outline"}
                                className={`h-24 w-full flex flex-col items-center justify-center ${
                                    isToday ? "border-2 border-primary" : ""
                                } ${isCurrentWeek ? "bg-gray-100" : ""} ${
                                    !canOrder
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                } ${
                                    isOrdered
                                        ? "bg-green-500 hover:bg-green-600"
                                        : ""
                                } `}
                                onClick={() => handleDateClick(date)}
                                disabled={!canOrder}
                            >
                                <span className="text-sm font-bold">
                                    {format(date, "EEE")}
                                </span>
                                <span className="text-lg">
                                    {format(date, "d")}
                                </span>
                                {isOrdered && (
                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full mt-1">
                                        Ordered
                                    </span>
                                )}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Meals for{" "}
                            {selectedDate &&
                                format(selectedDate, "EEEE, MMMM d")}
                        </DialogTitle>
                        <DialogDescription>
                            Select your meal for this day
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {meals.map((meal) => (
                            <Card key={meal.id}>
                                <CardHeader>
                                    <CardTitle>{meal.name}</CardTitle>
                                    <CardDescription>
                                        {meal.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button
                                        onClick={() => handleOrderClick(meal)}
                                    >
                                        Order this meal
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hủy đặt cơm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel your order for{" "}
                            {selectedDate &&
                                format(selectedDate, "MMMM d, yyyy")}
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelOrder}>
                            Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
                {Array.from(orders).map(([dateString, meal]) => (
                    <div key={dateString} className="mb-2">
                        <span className="font-semibold">
                            {format(new Date(dateString), "EEEE, MMMM d")}:
                        </span>{" "}
                        {meal.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

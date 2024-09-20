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
import { useOrders } from "@/hooks/use-orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FoodOrderProps {
    user: User;
}

export default function FoodOrder({ user }: FoodOrderProps) {
    const queryClient = useQueryClient();
    const { data: orderData, error, isLoading } = useOrders();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const saveOrderMutation = useMutation({
        mutationFn: async (newOrder) => {
            await saveOrder(newOrder);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            // window.location.reload(); // Refresh the page after saving
        },
    });

    const deleteOrderMutation = useMutation({
        mutationFn: async (dateString) => {
            await deleteOrderByDateAndId(user.id, dateString);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            // window.location.reload(); // Refresh the page after deletion
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders</div>;

    const meals = [
        {
            id: 1,
            name: "Grilled Chicken Salad",
            description: "Fresh greens with grilled chicken breast",
        },
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
            if (orderData?.find((order) => order.date === dateString)) {
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

            const newOrder = {
                userId: user.id,
                date: dateString,
                mealId: meal.id,
                isEat: true,
            };

            saveOrderMutation.mutate(newOrder);
        }
        setIsMealDialogOpen(false);
    };

    const handleCancelOrder = async () => {
        if (selectedDate) {
            const dateString = format(selectedDate, "yyyy-MM-dd");
            deleteOrderMutation.mutate(dateString);
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
                    const isOrdered = orderData?.some(
                        (order) => order.date === dateString
                    );
                    const canOrder = isOrderable(date);
                    const isCurrentWeek = isBefore(date, nextWeekStart);

                    return (
                        <div key={index} className="relative">
                            <Button
                                variant={isOrdered ? "default" : "outline"}
                                className={`h-24 w-full flex flex-col items-center justify-center ${
                                    isToday ? "border-2 border-primary" : ""
                                } ${
                                    !canOrder
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                } ${
                                    isOrdered
                                        ? "bg-green-500 hover:bg-green-600"
                                        : ""
                                } ${isCurrentWeek ? "bg-gray-100" : ""}`}
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
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
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
                {orderData?.map((order) => (
                    <div key={order.date} className="mb-2">
                        <span className="font-semibold">
                            {format(new Date(order.date), "EEEE, MMMM d")}:{" "}
                        </span>
                        {meals.find((meal) => meal.id === order.mealId)?.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

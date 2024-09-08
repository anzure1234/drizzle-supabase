"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic (e.g., send data to API)
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex w-full flex-col items-center justify-center px-6 py-10 text-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900">
                    Drizzle Supabase
                </h1>
                <p className="mb-6 text-lg font-medium text-gray-600">
                    A simple starter for Drizzle and Supabase
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-900">
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="30"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="john@doe.com"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-gray-900">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}

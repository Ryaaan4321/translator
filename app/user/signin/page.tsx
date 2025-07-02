'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react'
import { FaGoogle } from "react-icons/fa";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showpassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/user");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-2 p-6 rounded-2xl shadow-xl border border-border bg-card">
                <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={async (e) => {
                            e.preventDefault();
                            await signIn("google", { callbackUrl: "/user" });
                        }}
                    >
                        <FaGoogle />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="block mb-1 text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="block mb-1 text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showpassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="w-full bg-neutral-800 cursor-pointer text-white"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
}

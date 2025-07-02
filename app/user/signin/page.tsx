'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    console.log("res = ",res)
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h2 className="text-xl font-bold">Sign In</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        Sign In
      </button>
      <button
        onClick={() => signIn("google")}
        className="bg-red-500 text-white p-2 rounded"
      >
        Sign In with Google
      </button>
    </div>
  );
}

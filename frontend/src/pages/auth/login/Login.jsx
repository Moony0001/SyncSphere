import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../../../components/common/Header";
import background from "../../../img/background.jpg";

export default function Login() {
  const [hamburger, setHamburger] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex min-h-screen flex-col">
      <Header hamburger={hamburger} setHamburger={setHamburger} />
      <main
        className="relative flex flex-1 items-center justify-center bg-cover bg-center px-4 py-12"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-center text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="mt-1 text-center text-sm text-gray-500">Community-Powered Motivation</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              className="input"
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              autoComplete="off"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="btn-primary w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Log In"}
            </button>
            {isError && <p className="text-center text-sm text-red-500">{error.message}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member yet?{" "}
            <Link to="/signup" className="font-semibold text-brand hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

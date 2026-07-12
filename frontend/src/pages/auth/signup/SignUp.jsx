import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Header from "../../../components/common/Header";
import background from "../../../img/back.jpg";

export default function SignUp() {
  const [hamburger, setHamburger] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    gender: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to Create Account");
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
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
          <h2 className="text-center text-2xl font-bold text-gray-800">Create your account</h2>
          <p className="mt-1 text-center text-sm text-gray-500">Community-Powered Motivation</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input"
                autoComplete="off"
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleInputChange}
                required
              />
              <input
                className="input"
                autoComplete="off"
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
            </div>
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
              placeholder="Password (min 8 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <select
              className="input text-gray-600"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="btn-primary w-full" disabled={isPending}>
              {isPending ? "Loading..." : "Sign Up"}
            </button>
            {isError && <p className="text-center text-sm text-red-500">{error.message}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

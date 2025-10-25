"use client";

import { useState } from "react";
import Link from "next/link";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import SocialButtons from "@/components/auth/SocialButtons";
import TextInput from "@/components/auth/TextInput";

export default function LoginSection() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: implement backend login with automatic session management
      // Session will be handled by NextAuth with secure HTTP-only cookies
      console.log("Login data:", formData);
      alert("Login successful! (Frontend only - backend not implemented yet)");
    }
  };

  const handleGitHubLogin = () => {
    // TODO: GitHub OAuth
    console.log("GitHub login clicked");
    alert("GitHub login will be implemented with NextAuth");
  };

  return (
    <div className="min-h-screen bg-[#FEF9E1] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Logo */}
        <div
          className="flex flex-col items-center"
          style={{ marginTop: "64px", marginBottom: "40px" }}
        >
          <img
            src="/images/logo.svg"
            alt="PanlasaLabs Logo"
            className="w-72 h-auto mb-2 drop-shadow-xl"
            style={{ maxWidth: "360px" }}
          />
        </div>

        <AuthFormContainer
          title="Sign in to your account"
          subtitle="Welcome back! Please enter your details"
          topActions={
            <>
              <SocialButtons onGitHub={handleGitHubLogin} />
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#6D2323]/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#454545]">
                    Or continue with email
                  </span>
                </div>
              </div>
            </>
          }
          bottom={
            <div className="text-center mt-6">
              <p className="text-[#454545] text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Email address"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#1a1a1a] font-medium text-sm">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[#6D2323] hover:text-[#8B3030] transition-colors duration-200 text-xs font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <TextInput
                label=""
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6D2323] text-white px-4 py-2.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm mt-6"
            >
              Sign in
            </button>
          </form>
        </AuthFormContainer>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6D2323] hover:text-[#8B3030] transition-colors duration-200 font-medium text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

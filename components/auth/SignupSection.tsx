"use client";

import { useState } from "react";
import Link from "next/link";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import SocialButtons from "@/components/auth/SocialButtons";
import TextInput from "@/components/auth/TextInput";

export default function SignupSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (formData.firstName.trim().length < 2)
      newErrors.firstName = "First name must be at least 2 characters";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.trim().length < 2)
      newErrors.lastName = "Last name must be at least 2 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: implement backend signup
      console.log("Signup data:", formData);
      alert("Signup successful! (Frontend only - backend not implemented yet)");
    }
  };

  const handleGitHubSignup = () => {
    // TODO: GitHub OAuth
    console.log("GitHub signup clicked");
    alert("GitHub signup will be implemented with NextAuth");
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
          title="Create your account"
          subtitle="Get started with PanlasaLabs today"
          topActions={
            <>
              <SocialButtons onGitHub={handleGitHubSignup} />
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
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="First name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                error={errors.firstName}
              />
              <TextInput
                label="Last name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                error={errors.lastName}
              />
            </div>
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

            <TextInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              error={errors.password}
            />

            <button
              type="submit"
              className="w-full bg-[#6D2323] text-white px-4 py-2.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm mt-2"
            >
              Create account
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

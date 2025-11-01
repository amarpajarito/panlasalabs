"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import SocialButtons from "@/components/auth/SocialButtons";
import TextInput from "@/components/auth/TextInput";

export default function LoginSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorMessage("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Attempt credentials sign-in with NextAuth
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      // Handle authentication errors
      if (result?.error) {
        // Display user-friendly error messages
        if (result.error.includes("verify your email")) {
          setErrorMessage(
            "Please verify your email before signing in. Check your inbox for the verification link."
          );
        } else if (result.error.includes("Invalid")) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(result.error);
        }
        setIsLoading(false);
        return;
      }

      // Successful sign-in - redirect to callback URL
      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle GitHub OAuth sign-in
  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await signIn("github", {
        callbackUrl,
      });
    } catch (error) {
      console.error("GitHub login error:", error);
      setErrorMessage("GitHub login failed. Please try again.");
      setIsLoading(false);
    }
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
              <SocialButtons
                onGitHub={handleGitHubLogin}
                disabled={isLoading}
              />
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
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

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
              disabled={isLoading}
              className="w-full bg-[#6D2323] text-white px-4 py-2.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import SocialButtons from "@/components/auth/SocialButtons";
import TextInput from "@/components/auth/TextInput";
import { createClient } from "@/lib/supabase/client";

export default function SignupSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Track success state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorMessage("");
    setSuccessMessage("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();
      const fullName = `${formData.firstName} ${formData.lastName}`;

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: fullName,
            full_name: fullName,
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      // Handle registration errors
      if (error) {
        if (error.message.includes("already registered")) {
          setErrorMessage(
            "This email is already registered. Please sign in instead."
          );
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Create user record in public.users table via API
        try {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: data.user.id,
              email: formData.email,
              name: fullName,
              first_name: formData.firstName,
              last_name: formData.lastName,
              provider: "email",
            }),
          });

          if (!res.ok) {
            const json = await res.json();
            console.error("Database error:", json);
          }
        } catch (err) {
          console.error("Database error:", err);
        }

        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMessage(
            "This email is already registered. Please sign in instead."
          );
          setIsLoading(false);
          return;
        }

        // Show success message for email confirmation
        setSuccessMessage(
          "Account created successfully! Please check your email to verify your account before signing in."
        );
        setIsLoading(false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  // Handle GitHub OAuth signup
  const handleGitHubSignup = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signIn("github", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("GitHub signup error:", error);
      setErrorMessage("GitHub signup failed. Please try again.");
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
          title="Create your account"
          subtitle="Get started with PanlasaLabs today"
          topActions={
            <>
              <SocialButtons
                onGitHub={handleGitHubSignup}
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
            {/* Error message display */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Success message display */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

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
              disabled={isLoading}
              className="w-full bg-[#6D2323] text-white px-4 py-2.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
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

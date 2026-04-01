
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAdmin } from "@/lib/actions/admin.actions";
import { Shield, Eye, EyeOff } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AdminLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signInAdmin({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        router.push("/admin");
      } else {
        setErrorMessage(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-dark-100">
          Admin Portal
        </h2>
        <p className="text-gray-500 font-medium">
          Secure access for platform administrators only.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@filevault.com"
                    {...field}
                    className="h-12 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400 font-medium"
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-bold text-gray-700">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="h-12 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400 font-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-bold text-red-500 mt-1" />
              </FormItem>
            )}
          />

          {errorMessage && (
             <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                <Shield className="w-4 h-4 shrink-0" />
                {errorMessage}
             </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-base shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Sign In to Admin Portal"
            )}
          </Button>

          <div className="pt-4 text-center">
            <Link
              href="/sign-in"
              className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
            >
              Back to User Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminLoginForm;

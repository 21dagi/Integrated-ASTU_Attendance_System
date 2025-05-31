"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldUser, Presentation, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { Toaster } from "./ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const roles = [
  { key: "admin", label: "Administrator", icon: ShieldUser },
  { key: "instructor", label: "Instructor", icon: Presentation },
  { key: "student", label: "Student", icon: GraduationCap },
];
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  type: z
    .enum(["admin", "instructor", "student"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    })
    .nullable(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [role, setRole] = useState<"admin" | "student" | "student" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirectUrl = params?.get("callbackUrl") || "/home";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      type: role,
    },
  });
  useEffect(() => {
    form.setValue("type", role);
  }, [role]);

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    if (!role) {
      toast.error("Please select a role before logging in");
      return;
    }
    console.log("Login data:", data);
    setIsLoading(true);
    // Simulate API call
    try {
      await signIn("credentials", {
        username: data.username,
        password: data.password,
        type: data.type,
        redirect: false,
      }).then((result) => {
        if (result?.error) {
          throw new Error(result.error);
        }
      });
      toast.success("Login successful!");
      // Redirect to home page after successful login

      router.push(redirectUrl);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("max-w-md w-full mx-auto", className)} {...props}>
      <Toaster />
      <Card className="shadow-lg bg-[#ffffff] border-0">
        {/* Removed border color */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-[#343a40]">
            Signin Here
          </CardTitle>
          <p className="text-sm text-[#6c757d]">
            Sign in to access your account
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <div className="space-y-6">
                <div className="flex justify-between gap-4">
                  {roles.map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      type="button"
                      onClick={() => setRole(key as typeof role)}
                      variant="outline"
                      className={cn(
                        "flex-1 flex flex-col items-center h-24 w-10 py-4 rounded-lg border-2 transition-all duration-200",
                        "bg-primary ",
                        "hover:border-gray-400 hover:bg-gray-200 hover:text-black hover:shadow-sm",
                        role === key
                          ? "border-[#007bff] text-[#212529]"
                          : "border-[#dee2e6] text-[#212529]"
                      )}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{label}</span>
                    </Button>
                  ))}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>university - ID</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your University ID"
                            className="text-primary-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="password"
                            className="text-primary-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full py-2 text-base font-medium transition-all hover:shadow-md bg-[#171718] hover:bg-[#2c2c2c] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldUser, Presentation, GraduationCap } from "lucide-react"

const roles = [
  { key: "admin", label: "Administrator", icon: ShieldUser },
  { key: "employee", label: "Employee", icon: Presentation },
  { key: "student", label: "Student", icon: GraduationCap },
]

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [role, setRole] = useState<"admin" | "employee" | "student" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert("Please select your role");
      return;
    }
  
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    // Redirect based on role
    switch (role) {
      case "admin":
        router.push("/admin/adminUI");
        break;
      case "employee":
        router.push("/employee/dashboard");
        break;
      case "student":
        router.push("/student/dashboard");
        break;
      default:
        alert("Invalid role selected");
        setIsLoading(false);
        return;
    }
  };

  return (
    <div className={cn("max-w-md w-full mx-auto", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-gray-800">ASTU Portal</CardTitle>
          <p className="text-sm text-gray-500">Sign in to access your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div className="flex justify-between gap-4">
                {roles.map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    type="button"
                    onClick={() => setRole(key as typeof role)}
                    variant="outline"
                    className={cn(
                      "flex-1 flex flex-col items-center h-24 py-4 rounded-lg border-2 transition-all duration-200",
                      "hover:border-primary hover:bg-primary/5 hover:shadow-sm",
                      role === key
                        ? "border-primary text-primary bg-primary/10"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@astu.edu.et" 
                    required 
                    className="focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <a 
                      href="#" 
                      className="ml-auto text-sm text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="focus-visible:ring-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-2 text-base font-medium transition-all hover:shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message;
      setError(errMsg || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter email or choose pre-defined one to login to dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 font-medium">
                  {error}
                </div>
              )}
              <div className="flex flex-wrap gap-2 justify-center pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setEmail("admin@gmail.com");
                    setPassword("adminpassword");
                  }}
                  className="text-xs h-7 px-3 rounded-2xl cursor-pointer"
                >
                  Admin: admin@gmail.com
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setEmail("staff@gmail.com");
                    setPassword("staffpassword");
                  }}
                  className="text-xs h-7 px-3 rounded-2xl cursor-pointer"
                >
                  Staff: staff@gmail.com
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setEmail("rony@gmail.com");
                    setPassword("staffrony");
                  }}
                  className="text-xs h-7 px-3 rounded-2xl cursor-pointer"
                >
                  Staff: rony@gmail.com
                </Button>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="underline hover:text-primary">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

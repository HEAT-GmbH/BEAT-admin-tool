"use client";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type FormData = z.infer<typeof schema>;

export const AuthForm = () => {
  const { login, isLoggingIn } = useAuth();
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid grid-cols-1 w-full gap-4">
        <FormInput
          control={control}
          name="email"
          schema={schema}
          id="email"
          label="Email"
          placeholder="Enter your email"
          autoComplete="email"
          startIcon="mail-line"
        />
        <FormInput
          control={control}
          name="password"
          schema={schema}
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="password"
          type="password"
          startIcon="lock-2-line"
        />
      </div>
      <p className="underline text-right mt-2">Forgot Password</p>
      <Button type="submit" className="mt-6 w-full">
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import CardWrapper from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { loginUser, verify2Fa } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const LoginForm = () => {
  const [verify, setVerify] = useState({
    isVerify: false,
    secret: "",
    user: { email: "" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      token: "",
    },
  });

  const onSubmitLogin = async (values: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);
    try {
      const user = await loginUser(values);
      if (user.enable2FA) {
        setVerify({ isVerify: true, secret: user.twoFASecret, user });
        form.reset({ email: "", password: values.password });
      } else {
        localStorage.setItem("userData", JSON.stringify(user));
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast("Error!", {
        description: "Invalid username or password",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitVerify = async (values: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);
    try {
      const isValidated = await verify2Fa({
        email: verify.user.email,
        token: values.token,
        secret: verify.secret,
      });

      if (isValidated !== null) {
        localStorage.setItem("userData", JSON.stringify(verify.user));
        router.push("/dashboard");
      } else {
        toast("Error!", {
          description: "Invalid two-factor code.",
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = verify.isVerify ? onSubmitVerify : onSubmitLogin;

  return (
    <CardWrapper
      headerLabel={verify.isVerify ? "Auth" : "Login"}
      description={
        verify.isVerify ? "Two-Factor Authentication" : "welcome back"
      }
      backButtonLabel={verify.isVerify ? undefined : "Don't have an account?"}
      backButtonHref="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {verify.isVerify ? (
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two-factor authentication code</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormDescription>
                      Enter the code from the two-factor app on your mobile
                      device.
                    </FormDescription>
                    <FormMessage>
                      {form.formState.errors.token?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="jhon.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.email?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.password?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message="" />
          <FormSuccess message="" />
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {verify.isVerify ? "Verify code" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import {
  Form,
  FormControl,
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
import { createUser } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export const RegisterForm = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setIsSubmitting(true);
    try {
      await createUser(values);
      router.push("/auth/login");
    } catch (error) {
      toast("Error!", {
        description: "User already exist!",
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Register"
      description="Register user"
      backButtonLabel="have an account?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormError message="" />
          <FormSuccess message="" />
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Creating" : "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { twoFaSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useRouter } from "next/navigation";
import { enable2FA } from "@/lib/actions/user.action";
import { toast } from "sonner";
import { useState } from "react";

interface Enable2faFormProps {
  email: string;
  secret: string;
}

export const Enable2faForm = ({ email, secret }: Enable2faFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof twoFaSchema>>({
    resolver: zodResolver(twoFaSchema),
    defaultValues: {
      pin: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof twoFaSchema>) => {
    setIsSubmitting(true);
    try {
      const user = await enable2FA({ email, ...values, secret });
      localStorage.setItem("userData", JSON.stringify({ ...user, _id: "1" }));
      router.push("/dashboard");
    } catch (error: any) {
      toast("Error!", {
        description: "invalid code or password",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
        <div className="space-y-4 w-full">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin code</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage>{form.formState.errors.pin?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Your current password is required to register a two-factor
                  authenticator app.
                </FormDescription>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormError message="" />
        <FormSuccess message="" />
        <Button disabled={isSubmitting} type="submit">
          Register with two-factor app
        </Button>
      </form>
    </Form>
  );
};

"use client";
import { RegisterForm } from "@/components/auth/register-form";
import { isAuthenticated } from "@/lib/utils";
import { redirect } from "next/navigation";
import React, { useLayoutEffect } from "react";

const RegisterPage = () => {
  useLayoutEffect(() => {
    const isAuth = isAuthenticated();
    if (isAuth) {
      redirect("/dashboard");
    }
  }, []);
  return <RegisterForm />;
};

export default RegisterPage;

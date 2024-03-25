"use client";
import { LoginForm } from "@/components/auth/login-form";
import { isAuthenticated } from "@/lib/utils";
import { redirect } from "next/navigation";
import React, { useLayoutEffect } from "react";

const LoginPage = () => {
  useLayoutEffect(() => {
    const isAuth = isAuthenticated();
    if (isAuth) {
      redirect("/dashboard");
    }
  }, []);

  return <LoginForm />;
};

export default LoginPage;

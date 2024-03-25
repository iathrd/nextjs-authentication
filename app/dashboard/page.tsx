"use client";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/utils";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const DasboardPage = () => {
  const router = useRouter();
  const value =
    typeof window !== "undefined" && localStorage.getItem("userData");
  const user = value ? JSON.parse(value) : { email: "" };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/auth/login");
  };

  useLayoutEffect(() => {
    const isAuth = isAuthenticated();
    if (!isAuth) {
      redirect("/auth/login");
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col mt-14">
      <div>
        <p>Hello {user.email}</p>
      </div>
      <div className="flex gap-4 mt-5">
        <Button>
          {user.enable2FA ? (
            "Disable 2FA"
          ) : (
            <Link href="/dashboard/enable2fa">Enable 2FA</Link>
          )}
        </Button>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default DasboardPage;

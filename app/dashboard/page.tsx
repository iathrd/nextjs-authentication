"use client";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/utils";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useLayoutEffect, useState } from "react";

const DasboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", enable2FA: false });

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/auth/login");
  };

  useLayoutEffect(() => {
    const isAuth = isAuthenticated();
    const value =
      typeof window !== "undefined" && localStorage.getItem("userData");
    const userData = value ? JSON.parse(value) : { email: "" };
    if (!isAuth) {
      redirect("/auth/login");
    }
    setUser(userData);
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col mt-14">
      <div>
        <p>Hello {user.email}</p>
      </div>
      <div className="flex gap-4 mt-5">
        {user.enable2FA ? (
          <Button>Disable 2FA</Button>
        ) : (
          <Link href="/dashboard/enable2fa">
            <Button>Enable 2FA</Button>
          </Link>
        )}

        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default DasboardPage;

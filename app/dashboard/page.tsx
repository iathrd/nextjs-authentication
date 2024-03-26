"use client";
import { Button } from "@/components/ui/button";
import { disable2FA } from "@/lib/actions/user.action";
import { isAuthenticated } from "@/lib/utils";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useLayoutEffect, useState } from "react";

const DasboardPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState({ email: "", enable2FA: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/auth/login");
  };

  const handleClick = async () => {
    setIsSubmitting(true);
    try {
      await disable2FA({ email: user.email });
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...user,
          enable2FA: false,
          twoFASecret: null,
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
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
          <Button disabled={isSubmitting} onClick={handleClick}>
            Disabled 2FA
          </Button>
        ) : (
          <Link href="/dashboard/enable2fa">
            <Button>Enable 2FA</Button>
          </Link>
        )}

        {user.enable2FA && (
          <Link href="/dashboard/recovery-code">
            <Button>Recovery codes</Button>
          </Link>
        )}

        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default DasboardPage;

"use client";
import { Enable2faForm } from "@/components/2fa/enable2fa-form";
import { Card } from "@/components/ui/card";
import { generateCode } from "@/lib/actions/user.action";
import { isAuthenticated } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";

const Enable2FAPage = () => {
  const value =
    typeof window !== "undefined" && localStorage.getItem("userData");
  const user = value ? JSON.parse(value) : { email: "" };
  const [data, setData] = useState({ qrCodeUrl: "", secret: "" });

  const generate2FA = async () => {
    const data = await generateCode({ email: user.email });
    setData(data);
  };

  useEffect(() => {
    generate2FA();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const isAuth = isAuthenticated();
    if (!isAuth) {
      redirect("/auth/login");
    }
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col ">
        <div className="flex">
          <Image src={data.qrCodeUrl} alt="qrcode" width={300} height={300} />
          <Card className="p-6 mt-6 w-[500px] h-max">
            <p className="font-semibold">Cant scan the code? </p>
            <p className="font-semibold">
              To add the entry manualy, provide the following details to the
              application on your phone.
            </p>
            <p className="font-semibold mt-5">
              Account: simklinik.com:{user.email}
            </p>
            <p className="font-semibold">Key: {data.secret}</p>
            <p className="font-semibold">Time based: Yes</p>
          </Card>
        </div>
        <div className="pl-4">
          <Enable2faForm email={user.email} secret={data.secret} />
        </div>
      </div>
    </div>
  );
};

export default Enable2FAPage;

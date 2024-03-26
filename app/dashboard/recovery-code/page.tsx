"use client";
import { generateRecoveryCode } from "@/lib/utils";

const SettingPage = () => {
  const generateCode = () => {
    let generatedCodes = [];

    for (let i = 0; i < 10; i++) {
      let recoveryCode = generateRecoveryCode();
      generatedCodes.push(recoveryCode);
    }

    console.log(generatedCodes.join(" "));

    return generatedCodes;
  };

  const recoveryCodes = generateCode();

  return (
    <div className="flex w-full flex-col justify-center  items-center gap-1 mt-16">
      <h1 className="font-semibold mb-12">
        Two-factor Authentication Recovery codes
      </h1>
      <ul
        className="grid grid-cols-2 w-[26rem] gap-3"
        style={{ listStyleType: "disc" }}
      >
        {recoveryCodes.map((code) => (
          <li key={code}>
            <p className="font-semibold">{code}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingPage;

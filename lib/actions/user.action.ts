"use server";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import * as OTPAuth from "otpauth";
import * as QRCode from "qrcode";
import { encode } from "hi-base32";
import crypto from "crypto";
import console from "console";

interface CreateUserParams {
  email: string;
  password: string;
  enable2FA?: boolean;
  twoFASecret?: string;
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const user = await User.findOne({ email: userData.email });

    if (user) {
      throw new Error("User already exists");
    }

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function loginUser(userData: CreateUserParams) {
  const { email, password } = userData;
  try {
    connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (password !== user.password) {
      throw new Error("Invalid username or password");
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const verify2Fa = (userData: {
  email: string;
  token: string;
  secret: string;
}) => {
  const { secret, email, token } = userData;

  // Verify the token
  let totp = new OTPAuth.TOTP({
    issuer: "simklinik.com",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });

  let delta = totp.validate({ token, window: 1 });

  return delta;
};

export async function enable2FA(userData: {
  email: string;
  secret?: string;
  pin: string;
  password: string;
}) {
  try {
    connectToDatabase();
    const { email, secret, pin, password } = userData;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    if (password !== user.password) {
      throw new Error("Password is incorrect");
    }

    // Verify the token
    let totp = new OTPAuth.TOTP({
      issuer: "simklinik.com",
      label: email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret,
    });

    let delta = totp.validate({ token: pin, window: 1 });

    if (delta !== null) {
      await User.findOneAndUpdate(
        { email },
        { twoFASecret: secret, enable2FA: true },
        { new: true }
      );
      return {
        ...JSON.parse(JSON.stringify(user)),
        twoFASecret: secret,
        enable2FA: true,
      };
    } else {
      throw new Error("Invalid two-factor code.");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateCode({ email }: { email: string }) {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  const base32_secret = base32;

  let totp = new OTPAuth.TOTP({
    issuer: "simklinik.com",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    secret: base32_secret,
  });

  let otpauth_url = totp.toString();
  const result = await QRCode.toDataURL(otpauth_url);
  return { qrCodeUrl: result, secret: base32_secret };
}

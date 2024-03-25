import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  enable2FA?: boolean;
  twoFASecret?: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  enable2FA: {
    type: Boolean,
    default: false,
  },
  twoFASecret: {
    type: String,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;

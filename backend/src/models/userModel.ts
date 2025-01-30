import mongoose, { Document, Schema, Types } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Create the schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;

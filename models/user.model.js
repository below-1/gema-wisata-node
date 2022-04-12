import { Schema, model } from 'mongoose'

export const UserSchema = new Schema({
  username: String,
  password: String,
  avatar: String,
})

export const User = model("User", UserSchema);

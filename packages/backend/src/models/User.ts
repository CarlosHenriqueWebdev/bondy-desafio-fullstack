import mongoose from 'mongoose'

// Define the User model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  password: { type: String, required: true },
})

export const User = mongoose.model('user', UserSchema)

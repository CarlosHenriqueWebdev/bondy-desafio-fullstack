/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'

// Define the Token Blacklist model
const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
})

export const Blacklist = mongoose.model('blacklist', BlacklistSchema)

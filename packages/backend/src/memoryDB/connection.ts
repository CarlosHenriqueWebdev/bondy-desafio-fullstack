import mongoose from 'mongoose'
import { User } from '../models/User'
import bcrypt from 'bcrypt'

// MongoDB connection function
export const connection = async () => {
  const connState = mongoose.connection.readyState
  if (connState.valueOf() !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    })
    console.log('Connected to MongoDB Atlas Database')

    // Ensure the test user is created
    const userMock = {
      name: 'Usuário teste',
      email: 'desafio@bondy.com.br',
      company: 'Desafio Bondy',
    }
    const userPassword = await bcrypt.hash('123456', 8)
    await User.findOneAndUpdate(
      { email: userMock.email },
      { ...userMock, password: userPassword },
      { upsert: true }
    )
  }
}

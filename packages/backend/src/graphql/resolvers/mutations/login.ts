import bcrypt from 'bcrypt'
import { User } from '../../../models/User' // Ensure you import the User model correctly

export const login = async (
  parent: any,
  args: { email: string; password: string },
  context: any,
  info: any
) => {
  // Find the user by email
  const user = await User.findOne({ email: args.email })
  if (!user) {
    throw new Error('User not found')
  }

  // Verify the password
  const isValid = await bcrypt.compare(args.password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }

  // Return user information
  return user
}

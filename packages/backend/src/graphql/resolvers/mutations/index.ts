import { User } from 'src/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { Blacklist } from 'src/models/Blacklist'

export default {
  login: async (_parent, args, _context) => {
    // Validate email is not empty
    if (args.email.trim() === '') {
      throw new Error('Email cannot be empty')
    }

    // Validate password is not empty
    if (args.password.trim() === '') {
      throw new Error('Password cannot be empty')
    }

    // Validate email format
    if (!validator.isEmail(args.email)) {
      throw new Error('Invalid email format')
    }

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

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    )

    // Return user information and token
    return {
      token,
      user: {
        name: user.name,
        email: user.email,
        company: user.company,
      },
    }
  },
  logout: async (_parent, _args, context) => {
    if (!context.user) {
      throw new Error('Unauthorized')
    }
    const authHeader = context.headers.Authorization || ''
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const expiresAt = jwt.decode(token).exp * 1000
      await Blacklist.create({ token, expiresAt })
    }
    return true
  },
}

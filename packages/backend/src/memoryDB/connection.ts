import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export const connection = async () => {
  try {
    const connState = mongoose.connection.readyState;
    if (connState !== 1) {
     await mongoose.connect(
        'mongodb+srv://test:99mM35scnc@test.5wrvlov.mongodb.net/test?retryWrites=true&w=majority',
        {
          dbName: 'test',
        }
      );
      console.log('Connected to MongoDB Atlas Database');

      // Ensure the test user is created
      const userMock = {
        name: 'Usuário teste',
        email: 'desafio@bondy.com.br',
        company: 'Desafio Bondy',
      };

      const userPassword = await bcrypt.hash('123456', 8);
      await User.findOneAndUpdate(
        { email: userMock.email },
        { ...userMock, password: userPassword },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);

    // Optionally, log the complete error stack for further debugging
    console.error('Error stack:', error.stack);
  }
};

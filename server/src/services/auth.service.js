import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';
import ROLES from '../constants/roles.js';

const prisma = new PrismaClient();

export const registerUser = async (userData) => {
  const { firstName, lastName, email, phone, password, city, country, profileImage } = userData;

  // Check if user exists by email or phone
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { phone }
      ]
    }
  });

  if (existingUser) {
    throw new Error('User with this email or phone already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      city,
      country,
      profileImage: profileImage || null,
      role: ROLES.USER
    }
  });

  const token = generateToken(newUser.id, newUser.role);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token
  };
};

export const loginUser = async (identifier, password) => {
  const isEmail = identifier.includes('@');
  
  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { phone: identifier }
  });

  if (!user) {
    throw new Error('Invalid credentials.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials.');
  }

  const token = generateToken(user.id, user.role);

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
};

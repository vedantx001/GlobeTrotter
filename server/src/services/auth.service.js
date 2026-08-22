import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwt.js';
import ROLES from '../constants/roles.js';

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
      passwordHash: hashedPassword,
      city,
      country,
      profileImage: profileImage || null,
      role: ROLES.USER
    }
  });

  const token = generateToken(newUser.id, newUser.role);

  // Remove passwordHash from response
  const { passwordHash: _, ...userWithoutPassword } = newUser;

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

  const userPasswordHash = user.passwordHash || user.password;
  const isPasswordValid = await bcrypt.compare(password, userPasswordHash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials.');
  }

  const token = generateToken(user.id, user.role);

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
};


import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { generateToken } from '../utils/jwt.js';
import ROLES from '../constants/roles.js';

export const registerUser = async (userData) => {
  let { firstName, lastName, name, email, phone, password, city, country, profileImage, avatar } = userData;

  if (!firstName && name) {
    const parts = name.trim().split(' ');
    firstName = parts[0];
    lastName = parts.slice(1).join(' ') || '';
  }

  // Check if user exists by email or phone
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        phone ? { phone } : { email }
      ]
    }
  });

  if (existingUser) {
    throw new Error('User with this email or phone already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName: firstName || 'Traveler',
      lastName: lastName || '',
      email,
      phone: phone || null,
      passwordHash: hashedPassword,
      city: city || null,
      country: country || null,
      profileImage: profileImage || avatar || null,
      role: ROLES.USER
    }
  });

  const token = generateToken(newUser.id, newUser.role);

  const { passwordHash: _, ...userWithoutPassword } = newUser;

  return {
    user: {
      ...userWithoutPassword,
      name: `${newUser.firstName} ${newUser.lastName || ''}`.trim(),
      avatar: newUser.profileImage
    },
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

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials.');
  }

  const token = generateToken(user.id, user.role);

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: {
      ...userWithoutPassword,
      name: `${user.firstName} ${user.lastName || ''}`.trim(),
      avatar: user.profileImage
    },
    token
  };
};


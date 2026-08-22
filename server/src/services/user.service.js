import prisma from '../utils/prisma.js';

export const updateProfile = async (userId, data) => {
  const { name, email, phone, city, country, bio, avatar } = data;

  // Split name into firstName and lastName (rudimentary)
  const [firstName, ...lastNameParts] = name ? name.split(' ') : ['', ''];
  const lastName = lastNameParts.join(' ') || undefined;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: firstName || undefined,
      lastName: lastName,
      email: email || undefined,
      phone: phone,
      city: city,
      country: country,
      bio: bio,
      profileImage: avatar
    }
  });

  const { passwordHash: _, ...userWithoutPassword } = updatedUser;
  // Map back to expected frontend fields
  return {
    ...userWithoutPassword,
    name: `${updatedUser.firstName} ${updatedUser.lastName || ''}`.trim(),
    avatar: updatedUser.profileImage
  };
};

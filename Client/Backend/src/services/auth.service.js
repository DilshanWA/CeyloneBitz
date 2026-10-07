import prisma from "../config/database.js";
import argon2 from 'argon2';

export async function loginAdmin(email, password) {
  const admin = await prisma.admin.findUnique({
    where: { 
        email,
    },
  });

  if(!admin || !admin.isActive){
    return null;
  }
  const passwordValid = await argon2.verify(
    admin.passwordHash,
    password
  );

  if(!passwordValid){
    return null;
  }
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }

}

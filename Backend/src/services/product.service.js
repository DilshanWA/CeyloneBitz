import prisma from "../config/database.js";

export async function getProducts({ category, search }) {
  const where = {
    isAvailable: true,
  };

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  return prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id) {
  return prisma.product.findFirst({
    where: {
      id,
      isAvailable: true,
    },
    include: {
      category: true,
    },
  });
}

export async function createProduct(data){
  return prisma.product.create({
    data,
    include:{
      category: true,
    }
  })
}

export async function updateProduct(id,data){
  return prisma.product.update({
    where:{
      id,
    },
    data,
    include:{
      category: true,
    }
  })
}

export async function deactivateProduct(id){
  return prisma.product.update({
    where:{
      id,
    },
    data:{
      isAvailable: false,
    }
  })
}
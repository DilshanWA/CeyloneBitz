import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const burgers = await prisma.category.create({
    data: {
      name: "Burgers",
      slug: "burgers",
      description: "Freshly prepared burgers",
    },
  });

  const pizza = await prisma.category.create({
    data: {
      name: "Pizza",
      slug: "pizza",
      description: "Fresh oven-baked pizzas",
    },
  });

  const rice = await prisma.category.create({
    data: {
      name: "Rice",
      slug: "rice",
      description: "Delicious rice dishes",
    },
  });

  const beverages = await prisma.category.create({
    data: {
      name: "Beverages",
      slug: "beverages",
      description: "Refreshing drinks",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        categoryId: burgers.id,
        name: "Classic Chicken Burger",
        slug: "classic-chicken-burger",
        description: "Crispy chicken fillet with fresh vegetables and our special sauce.",
        price: 850.0,
        stockQuantity: 50,
      },
      {
        categoryId: burgers.id,
        name: "Double Beef Burger",
        slug: "double-beef-burger",
        description: "Two juicy beef patties with cheese and fresh vegetables.",
        price: 1200.0,
        stockQuantity: 30,
      },
      {
        categoryId: pizza.id,
        name: "Margherita Pizza",
        slug: "margherita-pizza",
        description: "Classic pizza with tomato, mozzarella and basil.",
        price: 1400.0,
        stockQuantity: 25,
      },
      {
        categoryId: pizza.id,
        name: "Chicken Supreme Pizza",
        slug: "chicken-supreme-pizza",
        description: "Loaded pizza with chicken, vegetables and mozzarella.",
        price: 1800.0,
        stockQuantity: 20,
      },
      {
        categoryId: rice.id,
        name: "Chicken Fried Rice",
        slug: "chicken-fried-rice",
        description: "Fragrant fried rice with chicken, vegetables and egg.",
        price: 950.0,
        stockQuantity: 40,
      },
      {
        categoryId: rice.id,
        name: "Mixed Fried Rice",
        slug: "mixed-fried-rice",
        description: "Fried rice with chicken, seafood and fresh vegetables.",
        price: 1250.0,
        stockQuantity: 35,
      },
      {
        categoryId: beverages.id,
        name: "Coca Cola",
        slug: "coca-cola",
        description: "Refreshing chilled soft drink.",
        price: 250.0,
        stockQuantity: 100,
      },
      {
        categoryId: beverages.id,
        name: "Fresh Lime Juice",
        slug: "fresh-lime-juice",
        description: "Freshly squeezed lime juice.",
        price: 350.0,
        stockQuantity: 60,
      },
    ],
  });

  console.log("Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
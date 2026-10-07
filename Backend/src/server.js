import "dotenv/config";
import app from './app.js';
import prisma from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try{
        await prisma.$connect();
        console.log("Connected to the database");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.error("Failed to connect to the database");
        process.exit(1);
    }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
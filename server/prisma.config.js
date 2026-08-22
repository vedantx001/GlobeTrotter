import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/globetrotter",
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});

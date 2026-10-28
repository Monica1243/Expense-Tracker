import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host:     process.env.DB_HOST!,
    port:     Number(process.env.DB_PORT!),
    database: process.env.DB_NAME!,
    user:     process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  },
});

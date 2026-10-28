import {
  pgTable,
  serial,
  text,
  numeric,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("expense_category", [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Other",
]);

export const typeEnum = pgEnum("expense_type", ["inflow", "outflow"]);

export const expenses = pgTable("expenses", {
  id:        serial("id").primaryKey(),
  amount:    numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category:  categoryEnum("category").notNull(),
  type:      typeEnum("type").notNull(),
  date:      date("date").notNull(),
  note:      text("note").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

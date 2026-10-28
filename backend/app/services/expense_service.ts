import { db } from "@/db/connection";
import { expenses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type {
  ExpenseRow,
  CreateExpenseBody,
  UpdateExpenseBody,
} from "./types";

export async function getAllExpenses(): Promise<ExpenseRow[]> {
  return db
    .select()
    .from(expenses)
    .orderBy(desc(expenses.date)) as Promise<ExpenseRow[]>;
}

export async function createExpense(
  body: CreateExpenseBody
): Promise<ExpenseRow> {
  const [row] = await db
    .insert(expenses)
    .values({
      amount:   String(body.amount),
      category: body.category,
      type:     body.type,
      date:     body.date,
      note:     body.note ?? "",
    })
    .returning();

  return row as ExpenseRow;
}

export async function updateExpense(
  id: number,
  body: UpdateExpenseBody
): Promise<ExpenseRow | null> {
  const values: Record<string, unknown> = {};

  if (body.amount   !== undefined) values.amount   = String(body.amount);
  if (body.category !== undefined) values.category = body.category;
  if (body.type     !== undefined) values.type     = body.type;
  if (body.date     !== undefined) values.date     = body.date;
  if (body.note     !== undefined) values.note     = body.note;

  if (Object.keys(values).length === 0) return null;

  const [row] = await db
    .update(expenses)
    .set(values)
    .where(eq(expenses.id, id))
    .returning();

  return (row as ExpenseRow) ?? null;
}

export async function deleteExpense(id: number): Promise<boolean> {
  const result = await db
    .delete(expenses)
    .where(eq(expenses.id, id))
    .returning({ id: expenses.id });

  return result.length > 0;
}
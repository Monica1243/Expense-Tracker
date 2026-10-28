import type { NextRequest } from "next/server";
import { getAllExpenses, createExpense } from "@/app/services/expense_service"
import type { CreateExpenseBody, ApiError } from "@/app/services/types";

// GET /api/expenses
export async function GET(): Promise<Response> {
  try {
    const data = await getAllExpenses();
    return Response.json(data);
  } catch (e) {
    const error: ApiError = { error: "Failed to fetch expenses" };
    return Response.json(error, { status: 500 });
  }
}

// POST /api/expenses
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: CreateExpenseBody = await req.json();

    if (!body.amount || !body.category || !body.type || !body.date) {
      const error: ApiError = { error: "amount, category, type and date are required" };
      return Response.json(error, { status: 400 });
    }

    const row = await createExpense(body);
    return Response.json(row, { status: 201 });
  } catch (e) {
    const error: ApiError = { error: "Failed to create expense" };
    return Response.json(error, { status: 500 });
  }
}
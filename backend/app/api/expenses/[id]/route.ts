import type { NextRequest } from "next/server";
import { updateExpense, deleteExpense } from "@/app/services/expense_service";
import type { UpdateExpenseBody, ApiError } from "@/app/services/types";

// PUT /api/expenses/:id
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/expenses/[id]">
): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const body: UpdateExpenseBody = await req.json();

    const row = await updateExpense(Number(id), body);

    if (!row) {
      const error: ApiError = { error: "Expense not found or no fields to update" };
      return Response.json(error, { status: 404 });
    }

    return Response.json(row);
  } catch (e) {
    const error: ApiError = { error: "Failed to update expense" };
    return Response.json(error, { status: 500 });
  }
}

// DELETE /api/expenses/:id
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/expenses/[id]">
): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const deleted = await deleteExpense(Number(id));

    if (!deleted) {
      const error: ApiError = { error: "Expense not found" };
      return Response.json(error, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (e) {
    const error: ApiError = { error: "Failed to delete expense" };
    return Response.json(error, { status: 500 });
  }
}
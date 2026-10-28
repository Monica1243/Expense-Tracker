const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ExpenseCategory = "Food" | "Shopping" | "Travel" | "Bills" | "Other";
export type ExpenseType = "inflow" | "outflow";

export type Expense = {
  id: number;
  amount: string;      // Drizzle numeric comes back as string
  category: ExpenseCategory;
  type: ExpenseType;
  date: string;        // "yyyy-MM-dd"
  note: string | null;
  createdAt: string;
};

export type CreateExpenseBody = {
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  date: string;
  note?: string;
};

export type UpdateExpenseBody = Partial<CreateExpenseBody>;

// GET /api/expenses
export async function fetchExpenses(): Promise<Expense[]> {
  const res = await fetch(`${BASE_URL}/api/expenses`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

// POST /api/expenses
export async function createExpense(body: CreateExpenseBody): Promise<Expense> {
  const res = await fetch(`${BASE_URL}/api/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}

// PUT /api/expenses/:id
export async function updateExpense(
  id: number,
  body: UpdateExpenseBody
): Promise<Expense> {
  const res = await fetch(`${BASE_URL}/api/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

// DELETE /api/expenses/:id
export async function deleteExpense(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/expenses/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete expense");
}

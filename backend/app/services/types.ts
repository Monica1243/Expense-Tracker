export type ExpenseCategory =
  | "Food"
  | "Shopping"
  | "Travel"
  | "Bills"
  | "Other";

export type ExpenseType = "inflow" | "outflow";

// Shape of the DB row returned to the client
export type ExpenseRow = {
  id: number;
  amount: string;
  category: ExpenseCategory;
  type: ExpenseType;
  date: string;
  note: string | null;
  createdAt: Date;
};

// POST /api/expenses body
export type CreateExpenseBody = {
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  date: string;     
  note?: string;
};

// PUT /api/expenses/:id body — all fields optional
export type UpdateExpenseBody = Partial<CreateExpenseBody>;

// Standard API error shape
export type ApiError = {
  error: string;
};
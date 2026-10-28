"use client";

import {
  useState,
  useEffect,
  type FormEvent,
} from "react";

import {
  Wallet,
  Utensils,
  ShoppingBag,
  CarFront,
  Receipt,
  Ellipsis,
  Plus,
  CalendarDays,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import categories from "../../../data/categories.json";
import { createExpense, type ExpenseCategory, type ExpenseType } from "../../services/expense.service";

const PRIMARY = "#0E2522";
const PRIMARY_LIGHT = "#e8f0ef";
const PRIMARY_MID = "#1a4039";

const iconMap = { Utensils, ShoppingBag, CarFront, Receipt, Ellipsis };

type ExpenseForm = {
  amount: string;
  category: string;
  type: ExpenseType;
  date: string;
  note: string;
};

const initialExpense = (): ExpenseForm => ({
  amount: "",
  category: "",
  type: "outflow",
  date: "",
  note: "",
});

type Props = {
  onSuccess?: () => void; // called after a successful save so the table can refetch
};

export default function AddExpense({ onSuccess }: Props) {
  const [expense, setExpense] = useState<ExpenseForm>(initialExpense);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setExpense((prev) => ({
      ...prev,
      date: format(new Date(), "yyyy-MM-dd"),
    }));
  }, []);

  const handleChange = (field: keyof ExpenseForm, value: string) => {
    setExpense((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Number(expense.amount) <= 0 || !expense.category || !expense.date) return;

    setSubmitting(true);
    setFormError(null);

    try {
      await createExpense({
        amount:   Number(expense.amount),
        category: expense.category as ExpenseCategory,
        type:     expense.type,
        date:     expense.date,
        note:     expense.note || undefined,
      });

      setExpense({ ...initialExpense(), date: expense.date }); // keep date, reset rest
      onSuccess?.();
    } catch {
      setFormError("Failed to save expense. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full rounded-xl bg-white p-6 shadow-sm"
      style={{ border: `1px solid ${PRIMARY_LIGHT}` }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-2" style={{ backgroundColor: PRIMARY_LIGHT, color: PRIMARY }}>
            <Wallet size={16} />
          </div>
          <div>
            <h1 className="text-sm font-semibold" style={{ color: PRIMARY }}>Add expense</h1>
            <p className="text-[11px] text-slate-400">Track your everyday spending</p>
          </div>
        </div>
        {formError && (
          <p className="text-[11px] text-red-500">{formError}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <form
          onSubmit={handleSubmit}
          className="grid min-w-[1000px] grid-cols-[1fr_1.2fr_0.9fr_1.1fr_1.5fr_auto] items-center gap-3"
        >
          {/* Amount */}
          <div className="relative flex h-9 items-center rounded-lg border border-[#b2cac8] bg-white px-3" style={{ color: PRIMARY }}>
            <span className="mr-1 text-xs font-semibold" style={{ color: PRIMARY }}>₹</span>
            <input
              id="amount"
              type="number"
              required
              min="0.01"
              step="any"
              value={expense.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-300"
              style={{ color: PRIMARY }}
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              id="category"
              required
              value={expense.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-[#b2cac8] bg-white px-3 pr-8 text-xs text-[#0E2522] outline-none focus:border-[#0E2522]"
            >
              <option value="" disabled>Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Type */}
          <div className="relative">
            <select
              id="type"
              value={expense.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border px-3 pr-8 text-xs outline-none"
              style={{
                borderColor: expense.type === "inflow" ? "#a7f3d0" : "#fecaca",
                color: expense.type === "inflow" ? "#065f46" : "#b91c1c",
                backgroundColor: expense.type === "inflow" ? "#f0fdf9" : "#fff5f5",
              }}
            >
              <option value="outflow">Outflow</option>
              <option value="inflow">Inflow</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Date */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-full items-center justify-between rounded-lg bg-white px-3 text-xs transition focus-visible:outline-none"
                style={{ border: "1px solid #b2cac8", color: PRIMARY }}
              >
                <span className="flex items-center gap-2">
                  <CalendarDays size={14} style={{ color: PRIMARY }} />
                  {expense.date ? format(parseISO(expense.date), "dd MMM yyyy") : "Select date"}
                </span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto rounded-xl bg-white p-3 shadow-xl" style={{ border: `1px solid ${PRIMARY_LIGHT}` }}>
              <Calendar
                mode="single"
                selected={expense.date ? parseISO(expense.date) : undefined}
                onSelect={(date) => {
                  if (!date) return;
                  handleChange("date", format(date, "yyyy-MM-dd"));
                  setCalendarOpen(false);
                }}
                className="rounded-lg bg-white p-3 text-slate-800"
                classNames={{
                  month: "flex flex-col gap-3",
                  month_caption: "flex h-9 items-center justify-center px-8",
                  caption_label: "text-sm font-semibold",
                  nav: "absolute top-3 left-3 right-3 flex items-center justify-between",
                  button_previous: "h-7 w-7 rounded-md hover:bg-[#e8f0ef]",
                  button_next: "h-7 w-7 rounded-md hover:bg-[#e8f0ef]",
                  weekdays: "flex w-full",
                  weekday: "flex-1 text-center text-xs font-medium text-slate-500",
                  week: "flex w-full mt-1",
                  day: "flex-1 p-0 text-center",
                  day_button: "mx-auto flex h-8 w-8 items-center justify-center rounded-md text-xs text-slate-700 hover:bg-[#e8f0ef]",
                  selected: "rounded-md bg-[#0E2522] text-white",
                  today: "font-semibold text-[#0E2522]",
                  outside: "text-slate-300",
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Note */}
          <input
            id="note"
            type="text"
            value={expense.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="Note (optional)"
            className="h-9 w-full rounded-lg px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400"
            style={{ border: `1px solid ${PRIMARY_LIGHT}` }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 text-xs font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: PRIMARY }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = PRIMARY_MID; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY; }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {submitting ? "Saving..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

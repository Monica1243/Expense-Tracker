"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Loader2, Trash2, Save, CalendarDays, ChevronDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  updateExpense,
  deleteExpense,
  type Expense,
  type ExpenseCategory,
  type ExpenseType,
} from "../../services/expense.service";
import categories from "../../../data/categories.json";

const PRIMARY       = "#0E2522";
const PRIMARY_LIGHT = "#e8f0ef";
const PRIMARY_MID   = "#1a4039";

type Props = {
  expense: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ExpenseDrawer({ expense, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    amount:   "",
    category: "" as ExpenseCategory | "",
    type:     "outflow" as ExpenseType,
    date:     "",
    note:     "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Populate form whenever a new expense is selected
  useEffect(() => {
    if (!expense) return;
    setForm({
      amount:   expense.amount,
      category: expense.category,
      type:     expense.type,
      date:     expense.date,
      note:     expense.note ?? "",
    });
    setError(null);
  }, [expense]);

  if (!expense) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (Number(form.amount) <= 0 || !form.category || !form.date) return;

    setSaving(true);
    setError(null);
    try {
      await updateExpense(expense.id, {
        amount:   Number(form.amount),
        category: form.category as ExpenseCategory,
        type:     form.type,
        date:     form.date,
        note:     form.note || undefined,
      });
      onSuccess();
      onClose();
    } catch {
      setError("Failed to update. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this expense?")) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteExpense(expense.id);
      onSuccess();
      onClose();
    } catch {
      setError("Failed to delete. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const fieldClass =
    "h-9 w-full appearance-none rounded-lg border border-[#b2cac8] bg-white px-3 text-xs outline-none focus:border-[#0E2522]";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
        style={{ borderLeft: `1px solid ${PRIMARY_LIGHT}` }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${PRIMARY_LIGHT}` }}
        >
          <div>
            <h2 className="text-sm font-semibold" style={{ color: PRIMARY }}>
              Edit Expense
            </h2>
            <p className="text-[11px] text-slate-400">ID #{expense.id}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col gap-4 px-5 py-5">

            {/* Amount */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: PRIMARY }}>
                Amount
              </label>
              <div
                className="flex h-9 items-center rounded-lg border border-[#b2cac8] px-3"
                style={{ color: PRIMARY }}
              >
                <span className="mr-1 text-xs font-semibold">₹</span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-300"
                  style={{ color: PRIMARY }}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: PRIMARY }}>
                Category
              </label>
              <div className="relative">
                <select
                  required
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={fieldClass}
                  style={{ color: PRIMARY }}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: PRIMARY }}>
                Type
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="h-9 w-full appearance-none rounded-lg border px-3 pr-8 text-xs outline-none"
                  style={{
                    borderColor: form.type === "inflow" ? "#a7f3d0" : "#fecaca",
                    color: form.type === "inflow" ? "#065f46" : "#b91c1c",
                    backgroundColor: form.type === "inflow" ? "#f0fdf9" : "#fff5f5",
                  }}
                >
                  <option value="outflow">Outflow</option>
                  <option value="inflow">Inflow</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: PRIMARY }}>
                Date
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-9 w-full items-center justify-between rounded-lg border border-[#b2cac8] bg-white px-3 text-xs"
                    style={{ color: PRIMARY }}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays size={13} style={{ color: PRIMARY }} />
                      {form.date ? format(parseISO(form.date), "dd MMM yyyy") : "Select date"}
                    </span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto rounded-xl bg-white p-3 shadow-xl"
                  style={{ border: `1px solid ${PRIMARY_LIGHT}` }}
                >
                  <Calendar
                    mode="single"
                    selected={form.date ? parseISO(form.date) : undefined}
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
            </div>

            {/* Note */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: PRIMARY }}>
                Note
                <span className="ml-1 font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="e.g. Lunch, groceries..."
                className={fieldClass}
                style={{ color: "#334155" }}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Footer actions — pinned to bottom */}
          <div
            className="mt-auto shrink-0 flex gap-3 px-5 py-4"
            style={{ borderTop: `1px solid ${PRIMARY_LIGHT}` }}
          >
            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              {deleting ? "Deleting..." : "Delete"}
            </button>

            {/* Update */}
            <button
              type="submit"
              disabled={saving || deleting}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition disabled:opacity-50"
              style={{ backgroundColor: PRIMARY }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = PRIMARY_MID; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY; }}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

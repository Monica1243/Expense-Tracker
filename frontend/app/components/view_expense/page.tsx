
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Search,
  FilterX,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import categories from "../../../data/categories.json";
import { fetchExpenses, type Expense } from "../../services/expense.service";
import ExpenseDrawer from "../expense_drawer/page";

type MonthGroup = {
  key: string;
  title: string;
  rows: Expense[];
  inflow: number;
  outflow: number;
  balance: number;
};

const PRIMARY = "#0E2522";
const PRIMARY_LIGHT = "#e8f0ef";

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function ViewExpense({ refreshKey, onRefresh }: { refreshKey: number; onRefresh?: () => void }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    let active = true;

    const loadExpenses = async () => {
      setLoading(true);
      try {
        const data = await fetchExpenses();
        if (active) setExpenses(data);
      } catch {
        if (active) setError("Unable to load expenses.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadExpenses();
    return () => { active = false; };
  }, [refreshKey]); // re-runs every time a new expense is added

  // Available months, newest first.
  const availableMonths = useMemo(() => {
    return [...new Set(
      expenses.map((item) => item.date.slice(0, 7))
    )].sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  // Apply all user-selected filters.
  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return expenses
      .filter((item) => {
        const matchesMonth =
          month === "all" ||
          item.date.startsWith(month);

        const matchesCategory =
          category === "all" ||
          item.category === category;

        const matchesType =
          type === "all" ||
          item.type === type;

        const matchesSearch =
          !query ||
          item.category.toLowerCase().includes(query) ||
          item.note.toLowerCase().includes(query) ||
          item.amount.toString().includes(query);

        return (
          matchesMonth &&
          matchesCategory &&
          matchesType &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        // Latest transaction date first.
        const dateOrder = b.date.localeCompare(a.date);

        if (dateOrder !== 0) return dateOrder;

        // For the same date, newest creation first.
        const createdOrder = (b.createdAt ?? "").localeCompare(
          a.createdAt ?? ""
        );

        if (createdOrder !== 0) return createdOrder;

        // Preserve the backend order if timestamps are absent.
        return 0;
      });
  }, [expenses, search, month, category, type]);

  // Group filtered transactions by month.
  const monthGroups = useMemo<MonthGroup[]>(() => {
    const groups = new Map<string, Expense[]>();

    filteredExpenses.forEach((expense) => {
      const key = expense.date.slice(0, 7);

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(expense);
    });

    return [...groups.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, rows]) => {
        const inflow = rows
          .filter((item) => item.type === "inflow")
          .reduce((sum, item) => sum + Number(item.amount), 0);

        const outflow = rows
          .filter((item) => item.type === "outflow")
          .reduce((sum, item) => sum + Number(item.amount), 0);

        return {
          key,
          title: format(
            parseISO(`${key}-01`),
            "MMMM yyyy"
          ),
          rows,
          inflow,
          outflow,
          balance: inflow - outflow,
        };
      });
  }, [filteredExpenses]);

  const resetFilters = () => {
    setSearch("");
    setMonth("all");
    setCategory("all");
    setType("all");
  };

  const inputClass =
    "h-8 w-full rounded-md border border-[#d7e4e1] " +
    "bg-white px-2.5 text-xs text-[#0E2522] outline-none " +
    "focus:border-[#0E2522]";

  return (
  <>
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#e8f0ef] bg-white shadow-sm" style={{ height: "calc(100vh - 265px)", minHeight: "300px" }}>

        {/* Fixed Header */}
        <div className="shrink-0 border-b border-slate-100 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundColor: PRIMARY_LIGHT,
                  color: PRIMARY,
                }}
              >
                <Wallet size={16} />
              </div>

              <div>
                <h1 className="text-sm font-semibold text-[#0E2522]">
                  View Expenses
                </h1>
                <p className="text-[11px] text-slate-400">
                  Monthly transaction history
                </p>
              </div>
            </div>

            <span className="rounded-md bg-[#e8f0ef] px-2 py-1 text-[11px] font-medium text-[#0E2522]">
              {filteredExpenses.length} transactions
            </span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            {/* Search */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>

            {/* Month */}
            <select
              aria-label="Filter by month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={inputClass}
            >
              <option value="all">All Months</option>

              {availableMonths.map((item) => (
                <option key={item} value={item}>
                  {format(
                    parseISO(`${item}-01`),
                    "MMM yyyy"
                  )}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="all">All Categories</option>

              {[...new Set([
                ...categories.map((item) => item.name),
                ...expenses.map((item) => item.category),
              ])].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Transaction Type */}
            <select
              aria-label="Filter by transaction type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass}
            >
              <option value="all">All Types</option>
              <option value="inflow">Inflow</option>
              <option value="outflow">Outflow</option>
            </select>

            {/* Reset */}
            <button
              type="button"
              onClick={resetFilters}
              className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#e8f0ef] px-3 text-xs font-medium text-[#0E2522] hover:bg-[#d9e8e5]"
            >
              <FilterX size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="min-h-0 flex-1 overflow-auto">

          {loading ? (
            <div className="flex h-full items-center justify-center gap-2 text-slate-500">
              <Loader2
                size={20}
                className="animate-spin"
              />
              Loading expenses...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              {error}
            </div>
          ) : monthGroups.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <Wallet size={32} />

              <p className="text-sm">
                No transactions found
              </p>
            </div>
          ) : (
            <div className="min-w-[750px]">

              {monthGroups.map((group) => (
                <section key={group.key}>

                  {/* Month Heading + Totals */}
                  <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#dce9e6] bg-[#e8f0ef] px-4 py-2.5">

                    <div>
                      <h2 className="text-xs font-semibold text-[#0E2522]">
                        {group.title}
                      </h2>

                      <p className="text-[10px] text-slate-500">
                        {group.rows.length} transactions
                      </p>
                    </div>

                    <div className="flex items-center gap-5">

                      {/* Inflow */}
                      <div>
                        <p className="mb-0.5 text-[10px] text-slate-500">
                          Inflow
                        </p>

                        <p className="text-xs font-semibold text-emerald-700">
                          +{currency(group.inflow)}
                        </p>
                      </div>

                      {/* Outflow */}
                      <div>
                        <p className="mb-0.5 text-[10px] text-slate-500">
                          Outflow
                        </p>

                        <p className="text-xs font-semibold text-red-600">
                          -{currency(group.outflow)}
                        </p>
                      </div>

                      {/* Net Amount */}
                      <div>
                        <p className="mb-0.5 text-[10px] text-slate-500">
                          Net Amount
                        </p>

                        <p
                          className={`text-xs font-semibold ${
                            group.balance >= 0
                              ? "text-[#0E2522]"
                              : "text-red-600"
                          }`}
                        >
                          {currency(group.balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Table */}
                  <table className="w-full table-fixed text-left text-sm">
                    <thead className="bg-[#f8faf9] text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="w-[18%] px-6 py-3 font-medium">
                          Date
                        </th>

                        <th className="w-[20%] px-6 py-3 font-medium">
                          Category
                        </th>

                        <th className="w-[30%] px-6 py-3 font-medium">
                          Notes
                        </th>

                        <th className="w-[15%] px-6 py-3 font-medium">
                          Type
                        </th>

                        <th className="w-[17%] px-6 py-3 text-right font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {group.rows.map((expense) => (
                        <tr
                          key={expense.id}
                          onClick={() => setSelectedExpense(expense)}
                          className="cursor-pointer transition-colors hover:bg-[#f4f8f7]"
                        >
                          <td className="px-6 py-4 text-slate-600">
                            {format(
                              parseISO(expense.date),
                              "dd MMM yyyy"
                            )}
                          </td>

                          <td className="px-6 py-4 font-medium text-[#0E2522]">
                            {expense.category}
                          </td>

                          <td className="truncate px-6 py-4 text-slate-500">
                            {expense.note || "—"}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                expense.type === "inflow"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {expense.type === "inflow" ? (
                                <ArrowDownLeft size={13} />
                              ) : (
                                <ArrowUpRight size={13} />
                              )}

                              {expense.type === "inflow"
                                ? "Inflow"
                                : "Outflow"}
                            </span>
                          </td>

                          <td
                            className={`px-6 py-4 text-right font-semibold ${
                              expense.type === "inflow"
                                ? "text-emerald-700"
                                : "text-red-600"
                            }`}
                          >
                            {expense.type === "inflow" ? "+" : "-"}
                            {currency(Number(expense.amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </section>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-3 text-xs text-slate-400">
          Showing {filteredExpenses.length} of{" "}
          {expenses.length} transactions
        </div>

    </div>

    <ExpenseDrawer
      expense={selectedExpense}
      onClose={() => setSelectedExpense(null)}
      onSuccess={() => {
        setSelectedExpense(null);
        onRefresh?.();
      }}
    />
  </>
  );
}
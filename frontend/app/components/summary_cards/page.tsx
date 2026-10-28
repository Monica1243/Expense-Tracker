"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { fetchExpenses } from "../../services/expense.service";

const PRIMARY = "#0E2522";
const PRIMARY_LIGHT = "#e8f0ef";

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

type Stats = { inflow: number; outflow: number };

export default function SummaryCards({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<Stats>({ inflow: 0, outflow: 0 });

  useEffect(() => {
    let active = true;

    fetchExpenses()
      .then((data) => {
        if (!active) return;
        const inflow  = data.filter((e) => e.type === "inflow") .reduce((s, e) => s + Number(e.amount), 0);
        const outflow = data.filter((e) => e.type === "outflow").reduce((s, e) => s + Number(e.amount), 0);
        setStats({ inflow, outflow });
      })
      .catch(() => {}); // silently fail — table will show its own error

    return () => { active = false; };
  }, [refreshKey]);

  const cards = [
    {
      label: "Total Balance",
      value: currency(stats.inflow - stats.outflow),
      icon: Wallet,
      iconBg: PRIMARY_LIGHT,
      iconColor: PRIMARY,
      valueColor: PRIMARY,
      border: `1px solid ${PRIMARY_LIGHT}`,
      bg: "#ffffff",
    },
    {
      label: "Total Inflow",
      value: currency(stats.inflow),
      icon: TrendingUp,
      iconBg: "#d1fae5",
      iconColor: "#065f46",
      valueColor: "#065f46",
      border: "1px solid #a7f3d0",
      bg: "#f0fdf9",
    },
    {
      label: "Total Outflow",
      value: currency(stats.outflow),
      icon: TrendingDown,
      iconBg: "#fee2e2",
      iconColor: "#991b1b",
      valueColor: "#b91c1c",
      border: "1px solid #fecaca",
      bg: "#fff5f5",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex h-[80px] items-center gap-4 rounded-xl px-5 shadow-sm"
            style={{ backgroundColor: card.bg, border: card.border }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: card.iconBg, color: card.iconColor }}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">{card.label}</p>
              <p className="truncate text-base font-semibold" style={{ color: card.valueColor }}>
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

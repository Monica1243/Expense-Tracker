"use client";

import { useState } from "react";
import AddExpense from "./components/add_expense/page";
import ViewExpense from "./components/view_expense/page";
import SummaryCards from "./components/summary_cards/page";

export default function Home() {
  // Incrementing this triggers ViewExpense to refetch
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f8f7" }}>
      <div className="mx-auto w-full max-w-9xl px-4 pt-6 pb-4 flex flex-col gap-4">
        <SummaryCards refreshKey={refreshKey} />
        <AddExpense onSuccess={() => setRefreshKey((k) => k + 1)} />
        <ViewExpense refreshKey={refreshKey} onRefresh={() => setRefreshKey((k) => k + 1)} />
      </div>
    </div>
  );
}

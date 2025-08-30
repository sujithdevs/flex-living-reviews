// components/TrendChart.jsx
"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Build monthly average rating points from reviews
function buildTrendPoints(reviews = []) {
  const buckets = new Map(); // key: YYYY-MM, value: {sum, count}
  for (const r of reviews) {
    if (!r?.date) continue;
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const cur = buckets.get(key) || { sum: 0, count: 0 };
    cur.sum += Number(r.rating) || 0;
    cur.count += 1;
    buckets.set(key, cur);
  }
  const arr = Array.from(buckets.entries()).map(([month, { sum, count }]) => ({
    month, avg: Math.round((sum / Math.max(count, 1)) * 100) / 100
  }));
  // sort by month asc
  arr.sort((a, b) => a.month.localeCompare(b.month));
  return arr;
}

export default function TrendChart({ reviews }) {
  const data = buildTrendPoints(reviews);

  if (!data.length) return <p className="text-sm text-gray-500">Not enough data for a trend chart.</p>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="avg" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// components/PropertyPerformance.jsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function PropertyPerformance({ perProperty = [] }) {
  const [sortKey, setSortKey] = useState("avgRating"); // avgRating | totalReviews | propertyName
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const rows = useMemo(() => {
    const copy = [...perProperty];
    copy.sort((a, b) => {
      const va = sortKey === "propertyName" ? (a[sortKey] || "").localeCompare(b[sortKey] || "") : Number(a[sortKey]) - Number(b[sortKey]);
      return sortDir === "asc" ? va : -va;
    });
    return copy;
  }, [perProperty, sortKey, sortDir]);

  const flip = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-600">
          <tr>
            <th className="py-2">Property</th>
            <th className="py-2 cursor-pointer" onClick={() => flip("avgRating")}>Avg rating</th>
            <th className="py-2 cursor-pointer" onClick={() => flip("totalReviews")}>Total reviews</th>
            <th className="py-2">Channels</th>
            <th className="py-2">Categories avg</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.listingId} className="border-t">
              <td className="py-2">
                <Link href={`/property/${p.listingId}`} className="text-blue-600 hover:underline">
                  {p.propertyName}
                </Link>
                <div className="text-xs text-gray-500">#{p.listingId}</div>
              </td>
              <td className="py-2 font-semibold">{p.avgRating.toFixed(2)}</td>
              <td className="py-2">{p.totalReviews}</td>
              <td className="py-2">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(p.channels).map(([name, count]) => (
                    <span key={name} className="rounded-full border px-2 py-0.5">{name} · {count}</span>
                  ))}
                </div>
              </td>
              <td className="py-2">
                <div className="grid grid-cols-3 gap-1">
                  {Object.entries(p.categoriesAvg).map(([k, v]) => (
                    <div key={k} className="rounded-md border px-1 py-0.5 text-xs">
                      {k}:{' '}<span className="font-semibold">{Number(v).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="py-4 text-gray-500" colSpan={5}>No properties to show.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

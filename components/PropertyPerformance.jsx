// components/PropertyPerformance.jsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function PropertyPerformance({ perProperty = [] }) {
  const [sortKey, setSortKey] = useState("avgRating"); // avgRating | totalReviews | propertyName
  const [sortDir, setSortDir] = useState("desc");       // asc | desc

  const rows = useMemo(() => {
    const copy = [...perProperty];
    copy.sort((a, b) => {
      if (sortKey === "propertyName") {
        const r =
          (a[sortKey] || "").localeCompare(b[sortKey] || "");
        return sortDir === "asc" ? r : -r;
      }
      const r = Number(a[sortKey]) - Number(b[sortKey]);
      return sortDir === "asc" ? r : -r;
    });
    return copy;
  }, [perProperty, sortKey, sortDir]);

  const flip = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <>
      {/* MOBILE/TABLET: card list */}
      <div className="block lg:hidden space-y-4">
        {rows.map((p) => (
          <div
            key={p.listingId}
            className="rounded-2xl border border-gray-200/60 bg-white/70 dark:bg-white/5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/property/${p.listingId}`}
                  className="text-blue-600 font-medium underline-offset-2 hover:underline"
                >
                  {p.propertyName}
                </Link>
                <div className="text-xs text-gray-500">#{p.listingId}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Avg rating</div>
                <div className="text-xl font-semibold">{p.avgRating.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{p.totalReviews} review{p.totalReviews !== 1 ? "s" : ""}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(p.channels).map(([name, count]) => (
                <span
                  key={name}
                  className="rounded-full border px-2 py-0.5 text-xs whitespace-nowrap"
                >
                  {name} · {count}
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(p.categoriesAvg).map(([k, v]) => (
                <span
                  key={k}
                  className="rounded-md border px-2 py-1 text-xs whitespace-nowrap"
                >
                  {k}: <strong>{Number(v).toFixed(1)}</strong>
                </span>
              ))}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-sm text-gray-500">No properties to show.</div>
        )}
      </div>

      {/* DESKTOP ONLY: table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-600">
            <tr>
              <th className="px-4 py-2 sticky left-0 bg-white z-10">Property</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => flip("avgRating")}>Avg rating</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => flip("totalReviews")}>Total reviews</th>
              <th className="px-4 py-2">Channels</th>
              <th className="px-4 py-2">Categories avg</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.listingId} className="border-t">
                <td className="px-4 py-2 sticky left-0 bg-white z-10 align-top">
                  <Link href={`/property/${p.listingId}`} className="text-blue-600 hover:underline break-words">
                    {p.propertyName}
                  </Link>
                  <div className="text-xs text-gray-500">#{p.listingId}</div>
                </td>
                <td className="px-4 py-2 font-semibold align-top">{p.avgRating.toFixed(2)}</td>
                <td className="px-4 py-2 align-top">{p.totalReviews}</td>
                <td className="px-4 py-2 align-top">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(p.channels).map(([name, count]) => (
                      <span key={name} className="rounded-full border px-2 py-0.5 text-xs whitespace-nowrap">
                        {name} · {count}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 align-top">
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(p.categoriesAvg).map(([k, v]) => (
                      <span key={k} className="rounded-md border px-2 py-1 text-xs whitespace-nowrap">
                        {k}: <strong>{Number(v).toFixed(1)}</strong>
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={5}>
                  No properties to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

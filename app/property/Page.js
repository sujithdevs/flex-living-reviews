cd $HOME\flex-living\flex-living-reviews

$dir = Join-Path (Resolve-Path .) 'app\property\[id]'
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$path = Join-Path $dir 'page.js'

$utf8 = New-Object System.Text.UTF8Encoding($false)
$content = @'
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReviewCard from "@/components/ReviewCard";

export default function PropertyPage({ params }) {
  const { id } = params;
  const [data, setData] = useState({ reviews: [] });
  const [approvedMap, setApprovedMap] = useState({});

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/reviews/hostaway", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
    };
    run();
    try {
      const raw = localStorage.getItem("approvedReviews");
      if (raw) setApprovedMap(JSON.parse(raw));
    } catch {}
  }, []);

  const propertyReviews = useMemo(() => {
    return (data.reviews || [])
      .filter(r => r.listingId?.toString() === id?.toString())
      .map(r => ({ ...r, approved: approvedMap[r.id] === true ? true : r.approved }))
      .filter(r => r.approved === true);
  }, [data.reviews, id, approvedMap]);

  const propertyName = propertyReviews[0]?.propertyName || `Property #${id}`;

  const onToggleApprove = (rid, next) => {
    const updated = { ...approvedMap, [rid]: next };
    setApprovedMap(updated);
    localStorage.setItem("approvedReviews", JSON.stringify(updated));
  };

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">{propertyName}</h1>
        <Link href="/" className="text-blue-600 hover:underline">← Back to dashboard</Link>
      </div>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Manager-approved reviews</h2>
        {propertyReviews.length === 0 ? (
          <p className="text-sm text-gray-500">No approved reviews yet. Approve from the dashboard first.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {propertyReviews.map((r) => (
              <li key={r.id} className="border rounded-xl p-4">
                <ReviewCard review={r} onToggleApprove={onToggleApprove} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
'@

[System.IO.File]::WriteAllText($path, $content, $utf8)

// app/property/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PropertyPage() {
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState(null);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/reviews/hostaway", { cache: "no-store" });
        const json = await res.json();
        setData(json);

        // filter approved for this property
        const reviews = (json.reviews || []).filter(
          (r) => r.listingId === id && r.approved
        );
        setApproved(reviews);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [id]);

  if (!data) return <main className="p-6">Loading property…</main>;

  const property = (data.perProperty || []).find((p) => p.listingId === id);

  if (!property) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Property #{id}</h1>
        <p className="text-slate-700">Not found in reviews data.</p>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      {/* Hero section */}
      <section className="relative h-64 w-full bg-slate-200 rounded-xl overflow-hidden">
        <img
          src="https://picsum.photos/1200/400?blur=2"
          alt="Property hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {property.propertyName}
          </h1>
        </div>
      </section>

      {/* Property summary */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-slate-700">
            Listing ID: <span className="font-mono">{property.listingId}</span>
          </p>
          <p className="text-slate-700">
            Average rating:{" "}
            <span className="font-bold">{property.avgRating.toFixed(2)}</span>
          </p>
          <p className="text-slate-700">
            Total reviews: {property.totalReviews}
          </p>
        </div>

        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-2">Category Averages</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(property.categoriesAvg || {}).map(([k, v]) => (
              <div
                key={k}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-800"
              >
                {k}: <span className="font-semibold">{Number(v).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approved reviews */}
      <section className="card p-4">
        <h2 className="text-xl font-semibold mb-3">Guest Reviews</h2>
        {approved.length === 0 && (
          <p className="text-slate-700 text-sm">
            No reviews have been approved for display yet.
          </p>
        )}
        <ul className="grid md:grid-cols-2 gap-4">
          {approved.map((r) => (
            <li key={r.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.guestName}</div>
                  <div className="text-xs text-slate-600">{r.date}</div>
                </div>
                <div className="font-bold">{r.rating} ⭐</div>
              </div>
              <p className="mt-2 text-slate-800">{r.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

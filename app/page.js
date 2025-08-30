// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Filters from "@/components/Filters";
import ReviewCard from "@/components/ReviewCard";
import PropertyPerformance from "@/components/PropertyPerformance";
import TrendChart from "@/components/TrendChart";

export default function DashboardPage() {
  const [data, setData] = useState({ reviews: [], perProperty: [], source: "mock" });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minRating: 0,
    category: "all",       // cleanliness, location, communication, checkIn, accuracy, value, all
    channel: "all",        // Airbnb, Booking.com, etc.
    time: "90",            // 7 | 30 | 90 | all  (days)
    approvedOnly: false,   // show only approved on dashboard if desired
    sort: "newest"         // newest | oldest | rating-desc | rating-asc
  });
  const [approvedMap, setApprovedMap] = useState({}); // { [reviewId]: true }

  // Load approvals from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("approvedReviews");
      if (raw) setApprovedMap(JSON.parse(raw));
    } catch {}
  }, []);

  // Fetch API
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/reviews/hostaway", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const reviewsWithApproval = useMemo(() => {
    return (data.reviews || []).map(r => ({
      ...r,
      approved: approvedMap[r.id] === true ? true : r.approved
    }));
  }, [data.reviews, approvedMap]);

  // Filter + sort logic
  const filteredReviews = useMemo(() => {
    const now = new Date();
    const days = filters.time === "all" ? null : Number(filters.time);
    const minRating = Number(filters.minRating) || 0;

    let out = [...reviewsWithApproval];

    if (filters.approvedOnly) {
      out = out.filter(r => r.approved === true);
    }

    if (minRating > 0) {
      out = out.filter(r => (Number(r.rating) || 0) >= minRating);
    }

    if (filters.channel !== "all") {
      out = out.filter(r => (r.channel || "").toLowerCase() === filters.channel.toLowerCase());
    }

    if (filters.category !== "all") {
      out = out.filter(r => {
        const c = r.categories || {};
        const v = Number(c[filters.category]);
        return Number.isFinite(v) && v > 0; // keep if it has that category score
      });
    }

    if (days) {
      out = out.filter(r => {
        const d = new Date(r.date);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= days;
      });
    }

    switch (filters.sort) {
      case "oldest":
        out.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "rating-desc":
        out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-asc":
        out.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      default:
        out.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest
    }

    return out;
  }, [reviewsWithApproval, filters]);

  const channels = useMemo(() => {
    const set = new Set((data.reviews || []).map(r => r.channel).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [data.reviews]);

  // Approval toggle handler
  const onToggleApprove = (id, next) => {
    setApprovedMap(prev => {
      const updated = { ...prev, [id]: next };
      // persist
      localStorage.setItem("approvedReviews", JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-white">Reviews Dashboard</h1>
        <p className="mt-4 text-sm text-gray-500">Loading reviews...</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-green-800">Reviews Dashboard</h1>
          <p className="text-sm text-gray-500">Data source: <span className="font-mono">{data.source}</span></p>
        </div>
        <Filters
          filters={filters}
          setFilters={setFilters}
          channels={channels}
        />
      </header>

      {/* Per-property table */}
      <section className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Per-property performance</h2>
          <span className="text-sm text-gray-500">{data.perProperty?.length || 0} properties</span>
        </div>
        <PropertyPerformance perProperty={data.perProperty || []} />
      </section>

      {/* Trend chart */}
      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Rating trend</h2>
        <TrendChart reviews={filteredReviews} />
      </section>

      {/* Reviews list */}
      <section className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <span className="text-sm text-gray-500">{filteredReviews.length} shown</span>
        </div>

        <ul className="grid md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => (
            <li key={r.id} className="border rounded-xl p-4">
              <ReviewCard review={r} onToggleApprove={onToggleApprove} />
              <div className="mt-3 text-sm">
                <Link className="text-blue-600 hover:underline" href={`/property/${r.listingId}`}>
                  View property page
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

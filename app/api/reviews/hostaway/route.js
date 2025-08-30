// app/api/reviews/hostaway/route.js
import { NextResponse } from "next/server";
import { normalizeReviews } from "@/lib/normalizeReviews";
import mock from "@/data/mock-reviews.json";

export async function GET() {
  const base = process.env.HOSTAWAY_API_BASE || "https://api-sandbox.hostaway.com";
  const apiKey = process.env.HOSTAWAY_API_KEY;
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;

  const url = new URL(`${base.replace(/\/$/, "")}/v1/reviews`);
  if (accountId) url.searchParams.set("account_id", accountId);

  let live = [];
  let used = "mock";

  try {
    const headers = {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...(apiKey ? { "X-API-KEY": apiKey } : {}),
      "Content-Type": "application/json"
    };

    const res = await fetch(url.toString(), { headers, cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      const maybeReviews =
        Array.isArray(data) ? data :
        Array.isArray(data?.reviews) ? data.reviews :
        Array.isArray(data?.result) ? data.result :
        [];

      if (maybeReviews.length > 0) {
        live = maybeReviews;
        used = "hostaway";
      }
    }
  } catch (_) {
    // fall back to mock
  }

  const source = used === "hostaway" ? live : mock;
  const reviews = normalizeReviews(source);
  const perProperty = aggregateByProperty(reviews);

  return NextResponse.json({ source: used, count: reviews.length, reviews, perProperty }, { status: 200 });
}

function aggregateByProperty(reviews) {
  const map = new Map();
  for (const r of reviews) {
    const key = r.listingId;
    const cur = map.get(key) || {
      listingId: r.listingId,
      propertyName: r.propertyName,
      totalReviews: 0,
      avgRating: 0,
      channels: {},
      categoriesAvg: { cleanliness: 0, location: 0, communication: 0, checkIn: 0, accuracy: 0, value: 0 }
    };

    cur.totalReviews += 1;
    cur.avgRating += r.rating || 0;
    if (r.channel) cur.channels[r.channel] = (cur.channels[r.channel] || 0) + 1;

    const c = r.categories || {};
    cur.categoriesAvg.cleanliness += c.cleanliness || 0;
    cur.categoriesAvg.location += c.location || 0;
    cur.categoriesAvg.communication += c.communication || 0;
    cur.categoriesAvg.checkIn += c.checkIn || 0;
    cur.categoriesAvg.accuracy += c.accuracy || 0;
    cur.categoriesAvg.value += c.value || 0;

    map.set(key, cur);
  }

  const out = [];
  for (const [, v] of map) {
    const t = v.totalReviews || 1;
    out.push({
      ...v,
      avgRating: round2(v.avgRating / t),
      categoriesAvg: {
        cleanliness: round2(v.categoriesAvg.cleanliness / t),
        location: round2(v.categoriesAvg.location / t),
        communication: round2(v.categoriesAvg.communication / t),
        checkIn: round2(v.categoriesAvg.checkIn / t),
        accuracy: round2(v.categoriesAvg.accuracy / t),
        value: round2(v.categoriesAvg.value / t)
      }
    });
  }
  return out;
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

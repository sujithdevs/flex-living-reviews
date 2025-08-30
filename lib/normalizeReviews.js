export function normalizeReviews(input = []) {
  return input.map((r, idx) => {
    const id = r.id?.toString() ?? `rev_${idx}`;
    const listingId = r.listingId?.toString?.() ?? r.listing_id?.toString?.() ?? "unknown";
    const propertyName = r.propertyName ?? r.property_name ?? r.listingName ?? "Unknown Property";
    const rating = Number(r.rating ?? r.overall ?? r.stars ?? 0);

    const categories = {
      cleanliness: num(r.categories?.cleanliness ?? r.cleanliness),
      location: num(r.categories?.location ?? r.location),
      communication: num(r.categories?.communication ?? r.communication),
      checkIn: num(r.categories?.checkIn ?? r.check_in ?? r.checkInRating),
      accuracy: num(r.categories?.accuracy ?? r.accuracy),
      value: num(r.categories?.value ?? r.value)
    };

    const channel = r.channel ?? r.source ?? "Unknown";
    const type = r.type ?? r.visibility ?? "public";
    const date = (r.date || r.createdAt || r.created_at || new Date().toISOString()).slice(0, 10);
    const guestName = r.guestName ?? r.reviewerName ?? r.author ?? "Guest";
    const content = r.content ?? r.comment ?? r.review ?? "";
    const approved = Boolean(r.approved ?? false);

    return { id, listingId, propertyName, rating, categories, channel, type, date, guestName, content, approved };
  });
}

function num(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : undefined;
}

// components/ReviewCard.jsx
"use client";

export default function ReviewCard({ review, onToggleApprove }) {
  const {
    id,
    listingId,
    propertyName,
    rating,
    categories = {},
    channel,
    type,
    date,
    guestName,
    content,
    approved,
  } = review;

  return (
    <div>
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-snug">{propertyName}</h3>
          <p className="text-xs text-gray-500">
            Listing #{listingId} • {channel} • {type}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString()}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-lg font-bold">
            {Number(rating).toFixed(1)} <span aria-hidden>⭐</span>
          </div>
          <button
            onClick={() => onToggleApprove(id, !approved)}
            className={`mt-2 rounded-lg px-3 py-1.5 text-sm border transition
              ${approved
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 hover:bg-gray-50"}`}
            aria-pressed={approved}
          >
            {approved ? "Approved" : "Approve"}
          </button>
        </div>
      </div>

      {/* body */}
      <p className="mt-3 text-gray-800">{content}</p>
      <p className="mt-1 text-xs text-gray-500">By {guestName}</p>

      {/* categories → chips that wrap on small screens */}
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries({
          Cleanliness: categories.cleanliness,
          Location: categories.location,
          Communication: categories.communication,
          "Check-in": categories.checkIn,
          Accuracy: categories.accuracy,
          Value: categories.value,
        }).map(([k, v]) => (
          <span
            key={k}
            className="rounded-md border px-2 py-1 text-xs bg-gray-50 whitespace-nowrap"
            title={`${k}: ${v ?? "-"}`}
          >
            {k} <strong>{v ?? "-"}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

// components/ReviewCard.jsx
"use client";

export default function ReviewCard({ review, onToggleApprove }) {
  const {
    id, listingId, propertyName, rating, categories = {},
    channel, type, date, guestName, content, approved
  } = review;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{propertyName}</h3>
          <p className="text-xs text-gray-500">Listing #{listingId} • {channel} • {type}</p>
          <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{Number(rating).toFixed(1)} ⭐</div>
          <button
            onClick={() => onToggleApprove(id, !approved)}
            className={`mt-2 rounded-lg px-3 py-1 text-sm border ${approved ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            aria-pressed={approved}
          >
            {approved ? "Approved" : "Approve"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-gray-800">{content}</p>
      <p className="mt-1 text-xs text-gray-500">By {guestName}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {Object.entries({
          Cleanliness: categories.cleanliness,
          Location: categories.location,
          Communication: categories.communication,
          "Check-in": categories.checkIn,
          Accuracy: categories.accuracy,
          Value: categories.value
        }).map(([k, v]) => (
          <div key={k} className="rounded-md border px-2 py-1">
            <span className="text-gray-500">{k}</span>
            <span className="float-right font-semibold">{v ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

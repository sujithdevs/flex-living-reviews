// components/Filters.jsx
"use client";

export default function Filters({ filters, setFilters, channels = ["all"] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
      <div>
        <label className="block text-xs text-gray-500">Min rating</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          className="mt-1 w-full rounded-lg border px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="mt-1 w-full rounded-lg border px-2 py-1"
        >
          <option value="all">All</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="location">Location</option>
          <option value="communication">Communication</option>
          <option value="checkIn">Check-in</option>
          <option value="accuracy">Accuracy</option>
          <option value="value">Value</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500">Channel</label>
        <select
          value={filters.channel}
          onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
          className="mt-1 w-full rounded-lg border px-2 py-1"
        >
          {channels.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500">Time</label>
        <select
          value={filters.time}
          onChange={(e) => setFilters({ ...filters, time: e.target.value })}
          className="mt-1 w-full rounded-lg border px-2 py-1"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500">Sort</label>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="mt-1 w-full rounded-lg border px-2 py-1"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="rating-desc">Rating: high to low</option>
          <option value="rating-asc">Rating: low to high</option>
        </select>
      </div>

      <div className="flex items-end">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.approvedOnly}
            onChange={(e) => setFilters({ ...filters, approvedOnly: e.target.checked })}
            className="h-4 w-4"
          />
          Approved only
        </label>
      </div>
    </div>
  );
}

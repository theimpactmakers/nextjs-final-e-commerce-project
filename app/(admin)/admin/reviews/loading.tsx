export default function ReviewsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-9 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow">
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

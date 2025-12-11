export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-9 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

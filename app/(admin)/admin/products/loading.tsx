export default function ProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-80 bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="h-10 bg-gray-100 rounded"></div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

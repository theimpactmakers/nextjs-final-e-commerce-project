export default function UserProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 animate-pulse">
        <div className="h-9 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded"></div>
      </div>

      {/* Tabs skeleton */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-4 px-1">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </nav>
      </div>

      {/* Content skeleton */}
      <div className="bg-card rounded-xl border shadow-sm animate-pulse">
        <div className="p-6 border-b border-border">
          <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

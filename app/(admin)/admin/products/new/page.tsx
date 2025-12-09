import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-gray-600">
            Create a new product with variants and images
          </p>
        </div>
      </div>

      {/* Form Placeholder */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Product Information
        </h2>
        <p className="text-gray-600">Product creation form coming soon...</p>
        <p className="mt-2 text-sm text-gray-500">
          For now, products can be managed directly in the Supabase dashboard.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-gray-600">{product.name}</p>
        </div>
      </div>

      {/* Form Placeholder */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Product Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <p className="mt-1 text-gray-900">{product.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meat Type
            </label>
            <p className="mt-1 text-gray-900">{product.meat_type || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age Group
            </label>
            <p className="mt-1 text-gray-900">{product.age_group || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <p className="mt-1 text-gray-600">{product.description || "—"}</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Product editing form coming soon...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            For now, products can be edited directly in the Supabase dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

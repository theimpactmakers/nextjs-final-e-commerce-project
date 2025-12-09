import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

async function getProducts(
  page: number = 1,
  perPage: number = 25,
  search: string = ""
) {
  const supabase = await createClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Build query with search filter
  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  let dataQuery = supabase
    .from("products")
    .select(
      `
      *,
      product_variants(count),
      product_images(count)
    `
    )
    .order("created_at", { ascending: false });

  // Apply search filter if provided
  if (search) {
    countQuery = countQuery.or(
      `name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`
    );
    dataQuery = dataQuery.or(
      `name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  // Get total count
  const { count } = await countQuery;

  // Get paginated data
  const { data: products } = await dataQuery.range(from, to);

  return {
    products: products || [],
    totalCount: count || 0,
    currentPage: page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.q || "";
  const { products, totalCount, currentPage, totalPages } = await getProducts(
    page,
    25,
    search
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Manage your product catalog, variants, and inventory
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <form method="GET" className="rounded-lg bg-white p-4 shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search products by name, slug, or description..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {search && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing results for:{" "}
              <span className="font-semibold">"{search}"</span>
            </p>
            <Link
              href="/admin/products"
              className="text-sm text-blue-600 hover:underline"
            >
              Clear search
            </Link>
          </div>
        )}
      </form>

      {/* Products Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Age Group</th>
                <th className="px-6 py-4">Variants</th>
                <th className="px-6 py-4">Images</th>
                <th className="px-6 py-4">Active</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="text-sm">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.meat_type || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      {product.age_group}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.product_variants?.[0]?.count || 0}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.product_images?.[0]?.count || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="rounded p-1 text-gray-600 hover:bg-gray-100"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 25 + 1} to{" "}
            {Math.min(currentPage * 25, totalCount)} of {totalCount} products
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/products?page=${currentPage - 1}${
                search ? `&q=${encodeURIComponent(search)}` : ""
              }`}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1
                  ) {
                    return (
                      <Link
                        key={pageNum}
                        href={`/admin/products?page=${pageNum}${
                          search ? `&q=${encodeURIComponent(search)}` : ""
                        }`}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          pageNum === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>
            <Link
              href={`/admin/products?page=${currentPage + 1}${
                search ? `&q=${encodeURIComponent(search)}` : ""
              }`}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

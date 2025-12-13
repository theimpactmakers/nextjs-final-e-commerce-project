import { createClient } from "@/lib/supabase/server";

export default async function DebugPage() {
  const supabase = await createClient();

  // Fetch all orders with detailed information
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, payment_status, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Calculate revenue
  const totalRevenue = orders
    ?.filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => {
      const amount = typeof order.total_amount === "string" 
        ? parseFloat(order.total_amount) 
        : order.total_amount;
      return sum + (amount || 0);
    }, 0) || 0;

  const paidOrders = orders?.filter((order) => order.payment_status === "paid") || [];
  const pendingOrders = orders?.filter((order) => order.payment_status === "pending") || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Order Debug Information</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Paid Orders</h3>
          <p className="text-2xl">{paidOrders.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-bold">Pending Orders</h3>
          <p className="text-2xl">{pendingOrders.length}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold">Total Revenue (Paid)</h3>
          <p className="text-2xl">€{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Orders:</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Order Number</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Payment Status</th>
              <th className="border border-gray-300 p-2">Order Status</th>
              <th className="border border-gray-300 p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className={order.payment_status === 'paid' ? 'bg-green-50' : ''}>
                <td className="border border-gray-300 p-2">{order.order_number}</td>
                <td className="border border-gray-300 p-2 font-bold">
                  €{typeof order.total_amount === "string" 
                    ? parseFloat(order.total_amount).toFixed(2) 
                    : order.total_amount.toFixed(2)}
                  <span className="text-xs text-gray-500 ml-2">
                    ({typeof order.total_amount})
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.payment_status === 'paid' ? 'bg-green-200' : 'bg-yellow-200'
                  }`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">{order.status}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Revenue Calculation Details:</h2>
      <div className="bg-gray-100 p-4 rounded">
        <pre className="text-sm">
          {JSON.stringify({
            totalOrders: orders?.length,
            paidOrders: paidOrders.length,
            pendingOrders: pendingOrders.length,
            calculatedRevenue: totalRevenue,
            paidOrderAmounts: paidOrders.map(o => ({
              order: o.order_number,
              amount: o.total_amount,
              type: typeof o.total_amount
            }))
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

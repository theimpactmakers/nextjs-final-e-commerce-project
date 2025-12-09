"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, updatePaymentStatus } from "./actions";

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        // Silent error - just revert
        setStatus(currentStatus);
      }
      // Silent success - no notification
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
        status
      )} ${
        isPending ? "opacity-50" : "cursor-pointer"
      } border-0 focus:ring-2 focus:ring-blue-500`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
      <option value="refunded">Refunded</option>
      <option value="failed">Failed</option>
    </select>
  );
}

export function PaymentStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updatePaymentStatus(orderId, newStatus);
      if (result.error) {
        // Silent error - just revert
        setStatus(currentStatus);
      }
      // Silent success - no notification
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "partially_refunded":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
        status
      )} ${
        isPending ? "opacity-50" : "cursor-pointer"
      } border-0 focus:ring-2 focus:ring-blue-500`}
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="failed">Failed</option>
      <option value="refunded">Refunded</option>
      <option value="partially_refunded">Partially Refunded</option>
    </select>
  );
}

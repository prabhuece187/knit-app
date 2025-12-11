// File: components/payment/PaymentActions.tsx
"use client";
import { Button } from "@/components/ui/button";

export function PaymentActions({
  total,
  used,
  balance,
  loading,
  onSubmit,
  onReset,
}: {
  total: number;
  used: number;
  balance: number;
  loading: boolean;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const balanceColor =
    balance === 0
      ? "text-green-600"
      : balance < 0
      ? "text-red-600"
      : "text-blue-600";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg bg-white shadow-md sticky bottom-0 z-10">
      <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
        <div className="py-2 px-3 bg-gray-50 border rounded-md text-center">
          <div className="text-xs text-gray-500">Total Payment</div>
          <div className="text-base font-bold text-gray-800">
            ₹{total.toFixed(2)}
          </div>
        </div>

        <div className="py-2 px-3 bg-gray-50 border rounded-md text-center">
          <div className="text-xs text-gray-500">Applied</div>
          <div className="text-base font-bold text-gray-800">
            ₹{used.toFixed(2)}
          </div>
        </div>

        <div className="py-2 px-3 border rounded-md text-center bg-white border-blue-200 shadow-sm">
          <div className="text-xs font-medium text-gray-600">
            {balance >= 0 ? "Balance" : "Over Applied"}
          </div>
          <div className={`text-lg font-extrabold ${balanceColor}`}>
            ₹{Math.abs(balance).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4 md:mt-0">
        <Button variant="outline" onClick={onReset} className="h-9 px-4">
          <span className="mr-2">🔄</span> Reset
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="h-9 px-4"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⚙️</span> Saving...
            </>
          ) : (
            <>
              <span className="mr-2">💾</span> Save Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
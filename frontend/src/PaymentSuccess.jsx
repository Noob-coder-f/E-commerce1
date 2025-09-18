import React from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const referenceId = queryParams.get("referenceId");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-800">Payment Successful 🎉</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase! Your payment has been successfully processed.
        </p>

        {/* Reference ID */}
        {referenceId && (
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Reference ID:</span>{" "}
            {referenceId}
          </p>
        )}

        {/* Action Button */}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-6 py-3 text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import React from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const referenceId = queryParams.get("referenceId");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
        {/* ✅ Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 sm:h-14 sm:w-14 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* ✅ Message */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Your payment has been received. Thank you for your purchase!
        </p>

        {/* ✅ Reference ID */}
        {referenceId && (
          <p className="mb-6 text-sm sm:text-base">
            <span className="font-medium text-gray-700">Reference ID: </span>
            <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-md text-gray-800 font-mono">
              {referenceId}
            </span>
          </p>
        )}

        {/* ✅ Back to Home */}
        <Link
          to="/"
          className="inline-block w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

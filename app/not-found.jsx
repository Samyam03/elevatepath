import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-6 py-12">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-gray-900 dark:text-white tracking-tight">404</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
            Page Not Found
          </h2>
        </div>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Sorry, the page you’re looking for doesn’t exist. It may have been moved or deleted,
          or you might have mistyped the address.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-medium px-6 py-3 rounded-md transition">
              Go Back Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

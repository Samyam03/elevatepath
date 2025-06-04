"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-6 px-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
        Cover Letter Preview
      </div>
      <div data-color-mode="dark">
        <MDEditor
          value={content}
          preview="preview"
          height={700}
          className="!bg-white dark:!bg-gray-900 !text-gray-800 dark:!text-gray-100 !border-none"
        />
      </div>
    </div>
  );
};

export default CoverLetterPreview;
"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterEditor = ({ 
  content: initialContent, 
  onChange 
}) => {
  const [localContent, setLocalContent] = useState(initialContent);

  const handleContentChange = (value) => {
    const newContent = value || "";
    setLocalContent(newContent);
    if (onChange) onChange(newContent);
  };

  return (
    <div className="py-6 px-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <div className="text-xl font-semibold text-gray-800 dark:text-white">
          Cover Letter Editor
        </div>
      </div>
      <div data-color-mode="light">
        <MDEditor
          value={localContent}
          onChange={handleContentChange}
          preview="edit"
          height={700}
          className="!bg-white dark:!bg-gray-900 !text-gray-800 dark:!text-gray-100 !border-none"
        />
      </div>
    </div>
  );
};

export default CoverLetterEditor;
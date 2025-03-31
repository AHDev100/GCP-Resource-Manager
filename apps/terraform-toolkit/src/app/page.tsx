'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showDescription, setShowDescription] = useState({
    upload: false,
    editor: false,
  });

  const toggleDescription = (option: "upload" | "editor") => {
    setShowDescription((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to the Terraform Visualization Dashboard
      </h1>
      <p className="text-lg mb-12 text-center">
        Select an option to continue
      </p>
      <div className="flex gap-16">
        <div className="flex flex-col items-center">
          <div
            className={`card bg-gray-800 rounded-lg overflow-hidden grid h-72 w-72 place-items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer`}
            onClick={() => toggleDescription("upload")}
          >
            <div className="p-4">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-2xl transition-colors duration-300 ${
                    showDescription.upload ? "text-blue-500" : "hover:text-red-500 text-gray-400"
                  }`}
                >
                  {showDescription.upload ? "↓" : "→"}
                </span>
                <span className="text-center block text-lg font-semibold">
                  File Upload (JSON/YAML)
                </span>
              </div>
              <div
                className={`mt-4 text-center text-gray-300 transition-all duration-300 ${
                  showDescription.upload ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                Upload your JSON or YAML files to visualize Terraform configurations.
              </div>
            </div>
          </div>
          <button
            className="mt-6 border border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-900 py-2 px-6 rounded-lg transition-all duration-300"
            onClick={() => router.push("/upload")}
          >
            Open Upload
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`card bg-gray-800 rounded-lg overflow-hidden grid h-72 w-72 place-items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer`}
            onClick={() => toggleDescription("editor")}
          >
            <div className="p-4">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-2xl transition-colors duration-300 ${
                    showDescription.editor ? "text-blue-500" : "hover:text-red-500 text-gray-400"
                  }`}
                >
                  {showDescription.editor ? "↓" : "→"}
                </span>
                <span className="text-center block text-lg font-semibold p-2">
                  UI Editor (Form/Code)
                </span>
              </div>
              <div
                className={`mt-4 text-center text-gray-300 transition-all duration-300 ${
                  showDescription.editor ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                Use the UI editor to create or modify Terraform configurations via forms or code.
              </div>
            </div>
          </div>
          <button
            className="mt-6 border border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-900 py-2 px-6 rounded-lg transition-all duration-300"
            onClick={() => router.push("/editor")}
          >
            Open Editor
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import yaml from "js-yaml"
import toast from "react-hot-toast";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    const validExtensions = [".json", ".yaml", ".yml"];
    const isValidExtension = validExtensions.some((ext) => file?.name.endsWith(ext));

    if (file != null && !isValidExtension) {
      toast.error("Invalid file type. Please upload a JSON or YAML file.");
      return;
    }
    
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
        if (readerEvent?.target?.result) {
          const content = readerEvent.target.result as string;
          try {
            if (file.name.endsWith(".json")) {
              JSON.parse(content); 
            } else if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
              yaml.load(content);
            }
            setFileContent(content); 
          } catch (error) {
            toast.error("Invalid file content. Please upload a valid JSON or YAML file.");
          }
        }
      };
      reader.readAsText(file); 
    }
  };

  const handleEditorSave = () => {
    if (!monacoInstance) return;
  
    const model = monacoInstance.editor.getModels()[0];
    const content = model.getValue(); 
    const markers = monacoInstance.editor.getModelMarkers({ resource: model.uri });
  
    if (markers.length > 0) {
      toast.error("Please fix the syntax errors in the editor before saving.");
      return;
    }
  
    try {
      if (fileName?.endsWith(".json")) {
        JSON.parse(content); 
      } else if (fileName?.endsWith(".yaml") || fileName?.endsWith(".yml")) {
        yaml.load(content); 
      }
  
      setFileContent(content);
      toast.success("Configuration saved successfully!");
    } catch (err) {
      toast.error("Invalid syntax in the editor. Please fix it before saving.");
    }
  };  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to the Upload Page
      </h1>
      <p className="text-lg mb-12 text-center max-w-2xl">
        Here's where you'll upload a custom configuration for resources you have made in YAML or JSON.
      </p>
      {!showEditor ? (
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-800 border border-gray-300 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 py-3 px-6 rounded-lg transition-all duration-300"
          >
            {fileName ? `Uploaded: ${fileName}` : "Upload File"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json,.yaml,.yml"
            className="hidden"
            onChange={handleFileUpload}
          />
          {fileName && (
            <p className="text-sm text-gray-400">
              File "{fileName}" has been uploaded successfully.
            </p>
          )}
          {fileContent && (
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all duration-300"
              onClick={() => {
                setShowEditor(true);
              }}
            >
              Preview & Edit
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="w-full max-w-4xl bg-gray-800 rounded-lg overflow-hidden">
            <MonacoEditor
              height="400px"
              defaultLanguage={fileName?.endsWith(".json") ? "json" : "yaml"}
              value={fileContent || ""}
              onChange={(value) => setFileContent(value || "")}
              theme="vs-dark"
              onMount={(_, monaco) => {
                setMonacoInstance(monaco);
              }}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
          <div className="flex justify-end mt-4 w-full max-w-4xl">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-all duration-300"
              onClick={handleEditorSave}
            >
              Save Configuration
            </button>
          </div>
        </>
      )}
    </div>
  );
}
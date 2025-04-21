'use client'

import { useState } from "react";
import dynamic from "next/dynamic";
import { gql, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const VALIDATE_TF = gql`
    mutation validate($config: String!) {
        validateConfig(config: $config){
            isValid
            errors
        }
    }
`;

export default function EditorPage() {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [tf, setTf] = useState<string>("");
    const [form, updateForm] = useState();
    const [monacoInstance, setMonacoInstance] = useState<any>(null);

    const [validate] = useMutation(VALIDATE_TF, {
        variables: {
            config: tf,
        }
    });

    const handleEditorValidate = async () => {
        if (!monacoInstance) return;
  
        const model = monacoInstance.editor.getModels()[0];
        const markers = monacoInstance.editor.getModelMarkers({ resource: model.uri });
    
        if (markers.length > 0) {
            toast.error("Please fix the syntax errors in the editor before saving.");
            return;
        }
        
        if (tf.length != 0){
            const { data } = await validate();
            console.log("Validation Response:", data);
            if (data?.validateConfig?.isValid) {
                toast.success("Config validated! You're good to go!");
            } else {
                toast.custom((t) => (
                    <div
                        className={`max-w-md w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg ${
                            t.visible ? "animate-enter" : "animate-leave"
                        }`}
                        role="alert"
                    >
                        <strong className="font-bold">Validation Failed - Try Again:</strong>
                        <ul className="mt-2 list-disc list-inside">
                            {data.validateConfig.errors.map((error : any, index : any) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="absolute top-2 right-2 text-red-700 hover:text-red-900"
                        >
                            ✕
                        </button>
                    </div>
                ));
            }        
        } else {
            toast.error("Maybe try writing some code before validating, thanks.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-12 relative">
            <div className="absolute top-24 right-24">
                <label className="inline-flex relative items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        readOnly
                    />
                    <div
                        onClick={() => {
                            setEnabled(!enabled);
                        }}
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                    {enabled ? (
                        <span className="ml-2 text-sm font-medium text-gray-300">
                            Form Editor
                        </span>
                    ) : (
                        <span className="ml-2 text-sm font-medium text-gray-300">
                            Terraform Editor
                        </span>
                    )}
                </label>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-center">
                Welcome to the Editor Page
            </h1>
            <p className="text-lg text-center mb-6 max-w-2xl">
                Craft your custom Terraform configurations effortlessly! Use our intuitive Form Editor for a guided experience or dive into the Standard Editor for full control. The choice is yours!
            </p>

            {enabled ? (
               <div>

               </div> 
            ) : (
                <>
                    <div className="w-full max-w-4xl bg-gray-800 rounded-lg overflow-hidden">
                    <MonacoEditor 
                        height="60vh"
                        defaultLanguage="hcl"
                        value={tf || ""}
                        onChange={(value) => setTf(value || "")}
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
                            onClick={handleEditorValidate}
                        >
                            Validate Configuration
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
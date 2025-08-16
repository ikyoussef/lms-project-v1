"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { error } from "console";
import toast from "react-hot-toast";
// ✅ ici uniquement
// import "@uploadthing/react/styles.css";

interface FileUploadProps {
    onChange: (url? : string) => void;
    endpoint : keyof typeof ourFileRouter;
}

export const FileUpload = ({onChange , endpoint} : FileUploadProps) => {
    return ( 
        <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error : Error) => {
                toast.error(`${error?.message}`)
            }}

            appearance={{
              container: "mt-2 border-dashed border-2 border-blue-300 rounded-md p-4 text-center",
              uploadIcon: "text-blue-400 h-12 w-12 mx-auto",
              label: "text-blue-600",
              button: "ut-ready:bg-blue-600 ut-uploading:bg-blue-400 after:bg-blue-500 bg-blue-500 text-white rounded-md p-2 mt-4",
              allowedContent: "text-xs text-blue-500 mt-1",
            }}
        />
    );
}

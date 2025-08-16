// Chemin : app/(dashboard)/teacher/courses/_components/image-form.tsx

"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { Attachment, Course } from "@prisma/client";
import { UploadDropzone } from "@/lib/uploadthing"; // Assurez-vous que le chemin est correct
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  url : z.string().min(1),
});

interface AttachmentFormProps {
  initialData: Course & { attachments : Attachment[]};
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);


  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course image updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };


    const onDelete = async (id : string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing &&(
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an file
            </>
          )}
          
        </Button>
      </div>
      {!isEditing &&
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attchment) => (
                <div key={attchment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {attchment.name}
                  </p>
                  { deletingId === attchment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin"/>
                    </div>
                  )}

                  { deletingId !== attchment.id && (
                    <button 
                      onClick={() => onDelete(attchment.id)}
                      className="ml-auto hover:opacity-75 transition">
                      <X className="h-4 w-4"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      }
      {isEditing && (
        <div className="mt-2">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}

            
            
            // ----- FIN DES CHANGEMENTS DE COULEUR -----
          />
          
          <div className="text-xs text-muted-foreground mt-4 text-center">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
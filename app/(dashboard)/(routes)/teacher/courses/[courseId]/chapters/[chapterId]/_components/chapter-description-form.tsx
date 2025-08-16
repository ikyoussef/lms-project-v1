// Chemin : app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react"; // 1. Importer useMemo
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Chapter } from "@prisma/client";
import dynamic from "next/dynamic"; // 2. Importer dynamic

interface ChapterDescriptionFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    description: z.string().min(1),
});

const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterDescriptionFormProps) => {
    // 3. Créer des versions des composants qui ne seront chargées que sur le client
    const Editor = useMemo(() => dynamic(() => import("@/components/editor").then(mod => mod.Editor), { ssr: false }), []);
    const Preview = useMemo(() => dynamic(() => import("@/components/preview").then(mod => mod.Preview), { ssr: false }), []);

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {!initialData.description && "No description"}
                    {initialData.description && (
                        <Preview value={initialData.description} />
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default ChapterDescriptionForm;
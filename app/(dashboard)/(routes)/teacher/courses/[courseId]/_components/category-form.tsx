"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form , FormField , FormControl , FormLabel , FormItem , FormDescription , FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { ToastBar } from "react-hot-toast";
import * as z from "zod";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps{
    initialData : Course;
    courseId : string;
    options : { label : string , value : string}[];
}


const formSchema = z.object({
    categoryId : z.string().min(1,{
        message : "Description is required",
    })
});


const CategoryForm = ({
    initialData,
    courseId,
    options
} : CategoryFormProps) => {

    const [isEditing , setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId : initialData?.categoryId || ""
        },
    });

    const {isSubmitting , isValid } = form.formState;

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}` , values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Category 
                <Button onClick={toggleEdit} variant="ghost">
                    {
                        isEditing ? (
                            <>Cancel</>
                        ) :
                        (
                            <>
                                <Pencil className="h-4 w-4 mr-2"/>
                                Edit Category
                            </>
                        )
                    }
                    
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.categoryId && "text-slate-500 italic"
                    )}>
                        {selectedOption?.label || "No Category"}
                    </p>
                )
            }
            {
                isEditing && (
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8"
                >
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                            {/* <FormLabel>
                                Course description
                            </FormLabel> */}
                            <FormControl>
                                <Combobox 
                                    options={options}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                What will you teach in this course?
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                        <div className="flex items-center gap-x-2">
                            <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                >
                                    Save
                            </Button>
                        </div>
                </form>
                </Form>
                )
            }
        </div>
    );
}

export default CategoryForm;
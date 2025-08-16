// ChapterList.tsx (avec dnd-kit)
"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Nouveau composant interne pour chaque élément draggable
const SortableChapter = ({ chapter, onEdit }: { chapter: Chapter; onEdit: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
            )}
        >
            <div
                {...listeners} // Le drag handle est maintenant ici
                className={cn(
                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                    chapter.isPublished && "border-r-sky-200 hover:bg-sky-300"
                )}
            >
                <Grip className="h-5 w-5" />
            </div>
            {chapter.title}
            <div className="ml-auto pr-2 flex items-center gap-x-2">
                {chapter.isFree && <Badge>Free</Badge>}
                <Badge className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")}>
                    {chapter.isPublished ? "Published" : "Draft"}
                </Badge>
                <Pencil onClick={() => onEdit(chapter.id)} className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
            </div>
        </div>
    );
};

// Votre composant principal mis à jour
interface ChapterListProps {
    items: Chapter[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
}

export const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
    const [chapters, setChapters] = useState(items);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setChapters((prevChapters) => {
                const oldIndex = prevChapters.findIndex((c) => c.id === active.id);
                const newIndex = prevChapters.findIndex((c) => c.id === over.id);
                const newOrder = arrayMove(prevChapters, oldIndex, newIndex);
                
                // Préparer les données pour la mise à jour
                const updateData = newOrder.map((chapter, index) => ({
                    id: chapter.id,
                    position: index,
                }));
                onReorder(updateData);
                
                return newOrder;
            });
        }
    };
    
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div>
                    {chapters.map((chapter) => (
                        <SortableChapter key={chapter.id} chapter={chapter} onEdit={onEdit} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
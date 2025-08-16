// Fichier : app/(course)/courses/[courseId]/_components/course-sidebar.tsx

"use client";

import { Chapter, Course, Purchase, UserProgress } from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item"; // On importe le composant enfant depuis son propre fichier
import { CourseProgress } from "@/components/course-progress";

// On définit un type plus complet qui inclut l'information d'achat
interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
        purchases?: Purchase[];
    };
    progressCount: number;
}

export const CourseSidebar = ({ course, progressCount }: CourseSidebarProps) => {
    // On déduit si le cours est acheté à partir des props.
    // Cette information est passée depuis le `CourseLayout` qui est un Server Component.
    const purchase = course.purchases?.[0];

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {/* On n'affiche la progression que si le cours a été acheté */}
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress
                            variant={progressCount === 100 ? "success" : "default"}
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        // La logique de verrouillage est parfaite.
                        // Elle sera maintenant correctement passée au bon composant enfant.
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    );
}

export default CourseSidebar;
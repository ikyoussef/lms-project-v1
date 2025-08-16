// Fichier : app/(course)/courses/[courseId]/_components/course-mobile-sidebar.tsx

"use client";

import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress } from "@prisma/client";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import CourseSidebar from "./course-sidebar"; // On réutilise la même barre latérale que pour le grand écran

// Type étendu pour le cours
type CourseWithProgress = Course & {
    chapters: (Chapter & {
        userProgress: UserProgress[] | null;
    })[];
};

interface CourseMobileSidebarProps {
    course: CourseWithProgress;
    progressCount: number;
}

export const CourseMobileSidebar = ({
    course,
    progressCount
}: CourseMobileSidebarProps) => {
    return (
        // Le composant "Sheet" agit comme un tiroir qui s'ouvre
        <Sheet>
            {/* Le déclencheur est l'icône "burger" qui ne s'affiche que sur mobile */}
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            {/* Le contenu du tiroir */}
            <SheetContent side="left" className="p-0 bg-white w-72">
                {/* À l'intérieur du tiroir, on affiche la même barre latérale que pour le bureau */}
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    )
}
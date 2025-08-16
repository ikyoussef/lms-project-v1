// Fichier : app/(course)/courses/[courseId]/_components/course-navbar.tsx

"use client"; // C'est un composant client car il contient d'autres composants clients

import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

// On étend le type Course pour qu'il inclue les chapitres,
// qui sont nécessaires pour la barre latérale mobile.
type CourseWithProgress = Course & {
    chapters: (Chapter & {
        userProgress: UserProgress[] | null;
    })[];
};

interface CourseNavbarProps {
    course: CourseWithProgress;
    progressCount: number;
}

export const CourseNavbar = ({
    course,
    progressCount,
}: CourseNavbarProps) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            {/* 
              Ce composant contient le bouton "burger" (SheetTrigger)
              et la logique pour afficher la barre latérale sur mobile.
              Il doit être un composant client.
            */}
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />

            {/* 
              Ce composant contient les boutons "Exit", "Teacher Mode" et le UserButton de Clerk.
              Il est partagé sur tout le site et doit être un composant client car il utilise
              des hooks de navigation et d'authentification côté client.
            */}
            <div className="ml-auto">
                <NavbarRoutes />
            </div>
        </div>
    );
};
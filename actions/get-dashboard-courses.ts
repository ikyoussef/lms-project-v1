// Fichier : actions/get-dashboard-courses.ts

import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        // 1. Trouver tous les cours que l'utilisateur a achetés
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        });

        // 2. Extraire les objets `course` de la liste des achats
        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        // 3. Calculer la progression pour chaque cours
        for (const course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        // 4. Séparer les cours en deux listes : complétés et en cours
        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);
        
        return {
            completedCourses,
            coursesInProgress,
        }

    } catch (error) {
        console.error("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        }
    }
}
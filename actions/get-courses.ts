// import { db } from "@/lib/db";
// import { Category, Chapter, Course } from "@prisma/client";
// import { title } from "process";
// import { getProgress } from "@/actions/get-progress";

// type CourseWithProgressWithCategory = Course & {
//     category : Category | null ;
//     chapters : {id : string} [];
//     progress : number | null;

// };


// type GetCourses = {
//     userId : string;
//     title?: string;

//     categoryId?: string;
    
// };

// export const getCourses = async ({
//     userId,
//     title,
//     categoryId,
// } : GetCourses): Promise<CourseWithProgressWithCategory[]> => {

//     try {
//         const courses = await db.course.findMany({
//             where : {
//                 isPublished : true,
//                 title : {
//                     contains : title,
//                 },
//                 categoryId,
//             } , 
//             include : {
//                 category : true,
//                 chapters : {
//                     where : {
//                         isPublished : true,
//                     } , 
//                     select : {
//                         id : true,
//                     }
//                 },
//                 purchases : {
//                     where : {
//                         userId,
//                     }
//                 }
//             },
//             orderBy : {
//                 createdAt : "desc",
//             }
//         });


//         const coursesWithProgress : CourseWithProgressWithCategory[] = await Promise.all(
//             courses.map(async course => {
//                 if(course.purchases.length === 0 ){
//                     return {
//                         ...course , 
//                         progress : null ,
//                     }
//                 }

//                 const progressPercenetge = await getProgress(userId , course.id);

//                 return {
//                     ...course,
//                     progress : progressPercenetge,
//                 }
//             })
//         );

//         return coursesWithProgress;
        
//     } catch (error) {
//         console.log("[GET_COURSES]" , error);
//         return [];
//     }
// }


// Fichier : actions/get-courses.ts

import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

// On rend userId optionnel en utilisant `?`
type GetCourses = {
    userId?: string;
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                // On n'inclut les achats que si un userId est fourni
                purchases: {
                    where: {
                        userId: userId || undefined, // Si userId est null/undefined, cette condition est ignorée
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        // Si l'utilisateur n'est pas connecté, on ne peut pas calculer la progression.
        if (!userId) {
            // On retourne les cours avec une progression nulle
            return courses.map(course => ({
                ...course,
                progress: null,
            }));
        }

        // Si l'utilisateur est connecté, on continue avec la logique de calcul de la progression
        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                // Si le cours n'a pas été acheté, la progression est nulle
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                }
            })
        );

        return coursesWithProgress;

    } catch (error) {
        console.error("[GET_COURSES]", error);
        return [];
    }
}
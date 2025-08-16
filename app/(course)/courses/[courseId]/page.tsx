// Fichier : app/(course)/courses/[courseId]/page.tsx

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image"; // Note: l'import peut être différent selon votre version de Next
import { auth } from "@clerk/nextjs/server";
import { File } from "lucide-react";

// On importe les composants nécessaires pour cette page
// import { CourseEnrollButton } from "./chapters/[chapterId]/_components/course-enroll-button";
// import { Separator } from "@/components/ui/separator";
// import { Preview } from "@/components/preview";
// import { Banner } from "@/components/banner";
// import { Button } from "@/components/ui/button";

const CourseIdPage = async ({
    params
}: {
    params: { courseId: string; }
}) => {
    // On peut récupérer le userId pour savoir si l'utilisateur est connecté
    const { userId } = await auth();

    // Récupérer toutes les informations du cours en une seule requête optimisée
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            isPublished: true, // On ne montre que les cours publiés
        },
        include: {
            category: true, // Inclure la catégorie pour afficher son nom
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc"
                }
            },
            // attachments: {
            //     orderBy: {
            //         createdAt: "desc"
            //     }
            // },
            // purchases: {
            //     where: {
            //         // On vérifie si l'utilisateur connecté a déjà acheté ce cours
            //         userId: userId || undefined
            //     }
            // }
        }
    });

    // Si le cours n'existe pas ou n'est pas publié, on redirige vers la page d'accueil
    if (!course) {
        return redirect("/");
    }
    
    // Vérifier si le cours a déjà été acheté par l'utilisateur connecté
    // const hasPurchased = course.purchases.length > 0;

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);

}

export default CourseIdPage;
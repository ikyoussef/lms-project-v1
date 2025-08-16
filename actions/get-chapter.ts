// Fichier : actions/get-chapter.ts

import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

// On définit le type de l'objet que la fonction va retourner
interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    try {
        // 1. Vérifier si l'utilisateur a acheté le cours
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            }
        });

        // 2. Récupérer les détails du cours
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true, // On ne peut voir que les chapitres des cours publiés
            },
            select: {
                price: true, // On a besoin du prix pour savoir s'il est gratuit
            }
        });

        // 3. Récupérer les détails du chapitre
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true, // On ne peut voir que les chapitres publiés
            }
        });

        // Si le cours ou le chapitre n'existe pas ou n'est pas publié, on retourne des objets vides
        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        // 4. Si l'utilisateur a acheté le cours OU si le chapitre est gratuit, on récupère les données "protégées"
        const hasAccess = purchase || chapter.isFree;

        if (hasAccess) {
            // Récupérer les données Mux pour la vidéo
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                }
            });

            // Récupérer les pièces jointes
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            });

            // Récupérer le prochain chapitre dans l'ordre
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position, // "gt" = greater than (plus grand que)
                    }
                },
                orderBy: {
                    position: "asc",
                }
            });
        }

        // 5. Récupérer la progression de l'utilisateur sur ce chapitre spécifique
        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            }
        });

        // 6. On retourne un objet bien structuré avec toutes les données nécessaires
        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        };

    } catch (error) {
        console.error("[GET_CHAPTER]", error);
        // En cas d'erreur, on retourne un objet vide pour éviter que la page ne plante
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
}
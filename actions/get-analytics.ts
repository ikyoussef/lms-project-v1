// Fichier : actions/get-analytics.ts

import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

// On définit un type pour nos données regroupées
type PurchaseWithCourse = Purchase & {
    course: Course;
};

// Fonction pour regrouper les achats par cours
const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.course.price!;
    });

    return grouped;
};


export const getAnalytics = async (userId: string) => {
    try {
        // 1. Trouver tous les achats pour les cours créés par cet enseignant
        const purchases = await db.purchase.findMany({
            where: {
                course: {
                    userId: userId
                }
            },
            include: {
                course: true,
            }
        });

        // 2. Regrouper les données pour le graphique
        const groupedEarnings = groupByCourse(purchases);
        
        // 3. Formater les données pour le composant de graphique
        // La plupart des bibliothèques de graphiques attendent un tableau d'objets
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        // 4. Calculer les statistiques globales
        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        return {
            data,
            totalRevenue,
            totalSales,
        }

    } catch (error) {
        console.error("[GET_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        }
    }
}
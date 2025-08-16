// Fichier : scripts/seed.ts (pour créer les cours)

import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        // --- 1. Récupérer les Catégories qui existent déjà ---
        console.log("Fetching existing categories...");

        // ===== CORRECTION : Utiliser `findFirst` au lieu de `findUnique` =====
        const csCategory = await database.category.findFirst({ where: { name: "Computer Science" } });
        const photoCategory = await database.category.findFirst({ where: { name: "Photography" } });
        const musicCategory = await database.category.findFirst({ where: { name: "Music" } });
        const engineeringCategory = await database.category.findFirst({ where: { name: "Engineering" } });
        // ====================================================================
        
        // S'assurer que les catégories existent avant de continuer
        if (!csCategory || !photoCategory || !musicCategory || !engineeringCategory) {
            console.error("One or more required categories were not found in the database. Please run the category seeding script first.");
            return; // On arrête l'exécution si les catégories ne sont pas là
        }
        console.log("Categories fetched successfully.");

        // --- 2. Supprimer uniquement les anciens cours pour éviter les doublons ---
        await database.course.deleteMany({});
        console.log("Deleted previous courses.");


        // --- 3. Créer les Cours et leurs Chapitres ---

        console.log("Creating new courses and chapters...");
        // == COURS 1 : Next.js Development (Publié et Payant) ==
        await database.course.create({
            data: {
                userId: "user_30BxtOVomANPr66JqlVC2tfdhl7", // Utilisez votre ID d'enseignant
                title: "Ultimate Next.js 14 Development",
                description: "<p>Master the latest features of Next.js, including the App Router, Server Actions, and advanced data fetching techniques. Build a full-stack application from scratch.</p>",
                imageUrl: "/images/courses/nextjs_course.jpg", // Assurez-vous d'avoir des images
                price: 49.99,
                isPublished: true,
                categoryId: csCategory.id,
                chapters: {
                    create: [
                        { title: "Introduction to the App Router", description: "<p>Learn the fundamentals of the new Next.js App Router.</p>", position: 1, isFree: true, isPublished: true },
                        { title: "Advanced Data Fetching", description: "<p>Explore server components, caching strategies, and revalidation.</p>", position: 2, isFree: false, isPublished: true },
                        { title: "Server Actions & Mutations", description: "<p>Handle form submissions and data mutations securely on the server.</p>", position: 3, isFree: false, isPublished: true },
                        { title: "Deployment and Final Project", description: "<p>Deploy your application to Vercel and finalize the project.</p>", position: 4, isFree: false, isPublished: true }
                    ]
                }
            }
        });

        // == COURS 2 : Photography Basics (Publié et Gratuit) ==
        await database.course.create({
            data: {
                userId: "user_30BxtOVomANPr66JqlVC2tfdhl7", // Utilisez votre ID d'enseignant
                title: "Beginner's Guide to Digital Photography",
                description: "<p>Understand your camera's settings, master composition, and learn the basics of photo editing. This course is perfect for beginners.</p>",
                imageUrl: "/images/courses/photography_course.jpg",
                price: 0,
                isPublished: true,
                categoryId: photoCategory.id,
                chapters: {
                    create: [
                        { title: "Understanding Exposure", description: "<p>The exposure triangle is the key.</p>", position: 1, isFree: true, isPublished: true },
                        { title: "Composition Rules", description: "<p>Learn about the rule of thirds.</p>", position: 2, isFree: true, isPublished: true },
                    ]
                }
            }
        });
        
        console.log("Successfully seeded the database.");

    } catch (error) {
        console.log("Error seeding the database:", error)
    } finally {
        await database.$disconnect();
    }
}

main();
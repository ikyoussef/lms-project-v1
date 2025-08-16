// Fichier : app/api/courses/[courseId]/checkout/route.ts

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        // 1. Authentification et validation de l'utilisateur
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 2. Vérifier que le cours existe et est publié
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            }
        });

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        // 3. Vérifier si l'utilisateur a déjà acheté ce cours pour éviter les doubles achats
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        });

        if (purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }
        
        // Si le cours est gratuit, on ne procède pas au paiement.
        // On pourrait créer une route séparée pour l'inscription aux cours gratuits.
        if (course.price === 0) {
            return new NextResponse("Course is free", { status: 400 });
        }

        // 4. Préparer les informations pour la session de paiement Stripe
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD", // Changez en "EUR", "CAD", etc. si nécessaire
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    // Le prix doit être en centimes
                    unit_amount: Math.round(course.price! * 100),
                }
            }
        ];

        // 5. Retrouver ou créer un client Stripe pour cet utilisateur
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: { userId: user.id },
            select: { stripeCustomerId: true }
        });

        // Si l'utilisateur n'a pas encore de profil client sur Stripe, on en crée un.
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        // 6. Créer la session de checkout Stripe
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            // URL de redirection après un succès ou un échec de paiement
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            // On ajoute des métadonnées qui seront cruciales pour notre webhook
            // C'est comme ça qu'on saura quel utilisateur a acheté quel cours
            metadata: {
                courseId: course.id,
                userId: user.id,
            }
        });

        // 7. Renvoyer l'URL de la session au client
        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
// Fichier : app/api/webhook/route.ts

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) { // ===== CORRECTION 1 : Utiliser `unknown` au lieu de `any` =====
        
        let errorMessage = "Unknown error occurred";
        // On vérifie si l'erreur est une instance de la classe Error
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        console.error("Webhook signature verification failed:", errorMessage);
        return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }

        try {
            await db.purchase.create({
                data: {
                    courseId: courseId,
                    userId: userId,
                }
            });
        } catch (dbError: unknown) { // On peut aussi typer les erreurs de base de données
            let errorMessage = "Database error occurred";
            if (dbError instanceof Error) {
                errorMessage = dbError.message;
            }
            console.error("Failed to create purchase record:", errorMessage);
            // On renvoie une erreur 500 car le problème vient de notre côté
            return new NextResponse(`Database Error: ${errorMessage}`, { status: 500 });
        }

    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}
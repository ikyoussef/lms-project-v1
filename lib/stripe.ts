// Fichier : lib/stripe.ts

import Stripe from "stripe";

// On vérifie que la clé secrète de Stripe est bien définie dans les variables d'environnement.
// Si elle n'est pas là, le serveur plantera au démarrage, ce qui est une bonne chose
// car cela vous alerte immédiatement d'une mauvaise configuration.
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
}

// On initialise le client Stripe avec la clé secrète et des options de configuration.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion:"2025-07-30.basil", // Toujours spécifier une version d'API pour éviter les "breaking changes".
    typescript: true,        // Active les types TypeScript pour une meilleure autocomplétion.
});
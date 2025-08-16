// Fichier : .../_components/course-enroll-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({
    price,
    courseId,
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            // 1. Appeler notre propre API pour créer une session de checkout Stripe
            const response = await axios.post(`/api/courses/${courseId}/checkout`);

            // 2. Rediriger l'utilisateur vers la page de paiement de Stripe
            window.location.assign(response.data.url);

        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto"
        >
            {isLoading ? "Loading..." : `Enroll for ${formatPrice(price)}`}
        </Button>
    )
}
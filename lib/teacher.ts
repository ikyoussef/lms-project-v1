export const isTeacher = (userId?: string | null): boolean => {
    // Si il n'y a pas de userId (visiteur non connecté), il ne peut pas être l'enseignant.
    if (!userId) {
        return false;
    }

    // On compare l'ID de l'utilisateur avec la variable d'environnement.
    // C'est la seule et unique source de vérité.
    return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
}

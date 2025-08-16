"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter, // Maintenant, il le trouvera
  AlertDialogHeader, // Et celui-ci aussi
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // <-- Le bon chemin, vers votre composant local

interface ConfirmModalProps {
    children : React.ReactNode;
    onConfirm : () => void;
}


export const ConfirmModal = ({children, onConfirm }: ConfirmModalProps) => {
    return ( 
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

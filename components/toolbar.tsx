// Fichier : components/toolbar.tsx

"use client";

import { type Editor } from "@tiptap/react";
import { Bold, Strikethrough, Italic, List, ListOrdered, Heading2, Link } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useCallback } from "react";

type Props = {
    editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
    if (!editor) {
        return null;
    }

    // NOUVELLE FONCTION POUR GÉRER LES LIENS
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        // Si la sélection est déjà un lien, on demande de le modifier
        const url = window.prompt('Enter URL', previousUrl);

        // Si l'utilisateur annule, on ne fait rien
        if (url === null) {
            return;
        }

        // Si l'utilisateur efface l'URL, on supprime le lien
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // Sinon, on applique le nouveau lien
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="border border-input bg-transparent rounded-md p-1 flex items-center gap-1 flex-wrap">
            {/* --- Style de texte --- */}
            <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()} >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()} >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()} >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            {/* --- AJOUT DU BOUTON LIEN --- */}
            {/* Ce n'est pas un Toggle, mais un bouton simple qui appelle notre fonction */}
            <button onClick={setLink} className="p-1.5 rounded-md hover:bg-slate-200">
                <Link className="h-4 w-4" />
            </button>

            <div className="w-[1px] h-8 bg-gray-200 mx-1"></div>

            {/* --- Types de bloc --- */}
            <Toggle size="sm" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
        </div>
    );
}
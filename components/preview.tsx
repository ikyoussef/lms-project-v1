// Fichier : components/preview.tsx

"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    const editor = useEditor({
        extensions: [StarterKit.configure()],
        content: value,
        editable: false,
        // ===== LA CORRECTION EST SUR LA LIGNE SUIVANTE =====
        immediatelyRender: false,
        // ==================================================
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert max-w-full",
            }
        }
    });

    return <EditorContent editor={editor} />;
};
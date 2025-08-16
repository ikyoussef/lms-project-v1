// Fichier : components/editor.tsx

"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './toolbar';

interface EditorProps {
    value: string;
    onChange: (richText: string) => void;
    disabled?: boolean;
}

export const Editor = ({ value, onChange, disabled }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
        ],
        content: value,
        editable: !disabled,
        // ===== LA CORRECTION EST SUR LA LIGNE SUIVANTE =====
        immediatelyRender: false,
        // ==================================================
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert prose-sm sm:prose-base max-w-full focus:outline-none rounded-md border min-h-[150px] border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",            }
        }
    });

    return (
        <div className="flex flex-col justify-stretch gap-2">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
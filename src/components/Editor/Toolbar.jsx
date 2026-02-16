import React from 'react';
import {
    Bold, Italic, Code, List, ListOrdered, CheckSquare, Quote,
    Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon,
    Table as TableIcon, FileCode, Clipboard
} from 'lucide-react';
import Button from '../UI/Button';
import './Toolbar.css';

const Toolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt('Image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const pasteAsCode = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                editor.chain().focus().setCodeBlock().insertContent(text).run();
            }
        } catch (err) {
            console.error('Failed to read clipboard:', err);
            // Fallback or user notification could go here
            alert('Failed to read clipboard. Please allow clipboard access.');
        }
    };

    return (
        <div className="toolbar-container">
            <div className="toolbar-group">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 size={18} />
                </Button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (Cmd+B)"
                >
                    <Bold size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (Cmd+I)"
                >
                    <Italic size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="Inline Code"
                >
                    <Code size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="Link"
                >
                    <LinkIcon size={18} />
                </Button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive('taskList')}
                    title="Task List"
                >
                    <CheckSquare size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote size={18} />
                </Button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <FileCode size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={pasteAsCode}
                    title="Paste as Code Block"
                >
                    <Clipboard size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={addImage}
                    title="Image"
                >
                    <ImageIcon size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    title="Insert Table"
                >
                    <TableIcon size={18} />
                </Button>
            </div>
        </div>
    );
};

export default Toolbar;

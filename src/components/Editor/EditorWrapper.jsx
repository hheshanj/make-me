import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Markdown } from 'tiptap-markdown';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// import { common, createLowlight } from 'lowlight';
import Toolbar from './Toolbar';
import './EditorWrapper.css';

// Initialize lowlight with common languages (lighter bundle)
// const lowlight = createLowlight(common);

const EditorWrapper = ({ viewMode = 'editor', onMarkdownChange }) => {
    const [markdownContent, setMarkdownContent] = useState('');

    const updateMarkdown = (md) => {
        setMarkdownContent(md);
        if (onMarkdownChange) {
            onMarkdownChange(md);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: true, // Enable default codeBlock
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Markdown.configure({
                transformPastedText: true,
                transformCopiedText: true,
            }),
            Image,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            // CodeBlockLowlight.configure({
            //   lowlight,
            // }),
        ],
        content: `
# Welcome to MakeMe

Start editing your README.md here. Use the toolbar above or markdown shortcuts.

- [x] Initialize Project
- [ ] Build Amazing Features

## Code Example
\`\`\`javascript
console.log("Hello World");
\`\`\`

---

Made with ❤️ by [Heshan Jayakody](https://github.com/hheshanj)
    `,
        autofocus: true,
        editorProps: {
            attributes: {
                class: 'prose-mirror-editor', // Target for CSS
            },
        },
        onUpdate: ({ editor }) => {
            const md = editor.storage.markdown.getMarkdown();
            updateMarkdown(md);
        },
        onCreate: ({ editor }) => {
            const md = editor.storage.markdown.getMarkdown();
            updateMarkdown(md);
        }
    });

    const isSplit = viewMode === 'split';
    const showEditor = viewMode === 'editor' || isSplit;
    const showMarkdown = viewMode === 'markdown' || isSplit;

    return (
        <div className="editor-layout">
            <div className="editor-main">
                {showEditor && editor && <Toolbar editor={editor} />}

                <div className="editor-workspace">
                    {/* WYSIWYG Editor */}
                    <div
                        className={`editor-pane ${showEditor ? 'visible' : 'hidden'} ${isSplit ? 'split' : ''}`}
                    >
                        <div className="editor-canvas-container">
                            <EditorContent editor={editor} className="editor-content" />
                        </div>
                    </div>

                    {/* Split Divider */}
                    {isSplit && <div className="split-divider" />}

                    {/* Raw Markdown View */}
                    <div
                        className={`markdown-pane ${showMarkdown ? 'visible' : 'hidden'} ${isSplit ? 'split' : ''}`}
                    >
                        <div className="markdown-header">
                            <span>Raw Markdown</span>
                        </div>
                        <textarea
                            className="markdown-textarea"
                            value={markdownContent}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorWrapper;

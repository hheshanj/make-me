import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import {
    CheckCheck, Bold, Italic, Strikethrough, Code, Code2,
    Heading1, Heading2, Heading3, Link, List, ListOrdered,
    Quote, Minus, Undo2, Redo2, Search, X
} from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import TableBuilder from './TableBuilder';
import ImageUploader from './ImageUploader';
import './EditorWrapper.css';
import AIAssistant from './AIAssistant';
import { Sparkles } from 'lucide-react';


/**
 * EditorWrapper Component
 *
 * A GitHub-style markdown editor with three view modes:
 * - Edit: Raw markdown editing
 * - Preview: Rendered HTML preview
 * - Split: Side-by-side edit and preview
 *
 * Features:
 * - Full markdown formatting toolbar
 * - Undo / Redo with keyboard shortcuts
 * - Find & Replace panel (Ctrl+H)
 * - Real-time preview rendering
 * - Auto-save integration via onMarkdownChange callback
 */

// Configure marked to match GitHub's markdown rendering
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
    sanitize: false,
});

const EditorWrapper = ({ viewMode = 'editor', onMarkdownChange, initialContent }) => {
    const [markdownContent, setMarkdownContent] = useState(initialContent || getDefaultContent());
    const [renderedHTML, setRenderedHTML] = useState('');
    const textareaRef = useRef(null);

    // History management for undo/redo
    const [history, setHistory] = useState([initialContent || getDefaultContent()]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isUndoRedo, setIsUndoRedo] = useState(false);
    const historyTimerRef = useRef(null);

    // Spell check toggle
    const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);

    // Find & Replace
    const [findReplaceOpen, setFindReplaceOpen] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const findInputRef = useRef(null);

    // AI Assistant
    const [aiOpen, setAiOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');


    // Render markdown whenever content changes
    useEffect(() => {
        try {
            const html = marked.parse(markdownContent);
            setRenderedHTML(html);
        } catch (error) {
            console.error('Markdown parsing error:', error);
            setRenderedHTML('<p style="color: red;">Error rendering markdown</p>');
        }
    }, [markdownContent]);

    // Notify parent of changes
    useEffect(() => {
        if (onMarkdownChange) {
            onMarkdownChange(markdownContent);
        }
    }, [markdownContent, onMarkdownChange]);

    // Track history for undo/redo (debounced)
    useEffect(() => {
        if (isUndoRedo) {
            setIsUndoRedo(false);
            return;
        }
        if (historyTimerRef.current) clearTimeout(historyTimerRef.current);

        historyTimerRef.current = setTimeout(() => {
            setHistory(prev => {
                const newHistory = prev.slice(0, historyIndex + 1);
                if (newHistory[newHistory.length - 1] !== markdownContent) {
                    return [...newHistory, markdownContent];
                }
                return prev;
            });
            setHistoryIndex(prev => {
                const newHistory = history.slice(0, prev + 1);
                if (newHistory[newHistory.length - 1] !== markdownContent) {
                    return prev + 1;
                }
                return prev;
            });
        }, 500);

        return () => { if (historyTimerRef.current) clearTimeout(historyTimerRef.current); };
    }, [markdownContent]);

    // Open find/replace → focus the find input
    useEffect(() => {
        if (findReplaceOpen && findInputRef.current) {
            setTimeout(() => findInputRef.current?.focus(), 50);
        }
    }, [findReplaceOpen]);

    const handleUndo = () => {
        if (historyIndex > 0) {
            setIsUndoRedo(true);
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setMarkdownContent(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setIsUndoRedo(true);
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setMarkdownContent(history[newIndex]);
        }
    };

    const handleMarkdownChange = (e) => {
        setMarkdownContent(e.target.value);
    };

    const handleSelect = (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        setSelectedText(markdownContent.substring(start, end));
    };

    /**
     * Replace currently selected text with new text (or insert at cursor)
     */
    const replaceSelection = (text) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const beforeText = markdownContent.substring(0, start);
        const afterText = markdownContent.substring(end);

        const newText = beforeText + text + afterText;
        setMarkdownContent(newText);

        setTimeout(() => {
            textarea.focus();
            const newPos = start + text.length;
            textarea.setSelectionRange(newPos, newPos);
            // Update selection state to empty execution
            setSelectedText('');
        }, 0);
    };

    /**
     * Insert text at cursor position or wrap selection
     */
    const insertAtCursor = (before, after = '', defaultText = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdownContent.substring(start, end) || defaultText;
        const beforeText = markdownContent.substring(0, start);
        const afterText = markdownContent.substring(end);

        const newText = beforeText + before + selectedText + after + afterText;
        setMarkdownContent(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    /**
     * Insert text at the start of the current line (for headings, lists, etc.)
     */
    const insertLinePrefix = (prefix) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const content = markdownContent;

        // Find the start of the current line
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;

        const newText = content.substring(0, lineStart) + prefix + content.substring(lineStart);
        setMarkdownContent(newText);

        setTimeout(() => {
            textarea.focus();
            const newPos = start + prefix.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    /**
     * Handle keyboard shortcuts
     */
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault(); handleUndo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault(); handleRedo();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault(); insertAtCursor('**', '**', 'bold text');
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault(); insertAtCursor('*', '*', 'italic text');
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault(); insertAtCursor('[', '](url)', 'link text');
        } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault(); insertAtCursor('\n```\n', '\n```\n');
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault(); insertAtCursor('`', '`', 'code');
        } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
            e.preventDefault(); insertAtCursor('~~', '~~', 'text');
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault(); setFindReplaceOpen(prev => !prev);
        }
    };

    /**
     * Find & Replace handler
     */
    const handleReplaceAll = () => {
        if (!findText) return;
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const newContent = markdownContent.replace(new RegExp(escaped, 'g'), replaceText);
        setMarkdownContent(newContent);
    };

    const matchCount = (() => {
        if (!findText) return 0;
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return (markdownContent.match(new RegExp(escaped, 'g')) || []).length;
    })();

    const handleEmojiSelect = (emoji) => insertAtCursor(emoji);
    const handleTableInsert = (table) => insertAtCursor(table);
    const handleImageInsert = (markdown) => insertAtCursor(markdown);

    const showEditor = viewMode === 'editor' || viewMode === 'split';
    const showPreview = viewMode === 'preview' || viewMode === 'split';

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return (
        <div className="editor-layout">
            <div className="editor-main">
                <div className="editor-workspace">
                    {/* Raw Markdown Editor Pane */}
                    {showEditor && (
                        <div className={`editor-pane ${viewMode === 'split' ? 'split' : ''}`}>
                            <div className="markdown-header">
                                <span>✏️ Edit</span>
                                <div className="editor-tools">
                                    <button
                                        className={`spell-check-toggle ${aiOpen ? 'active' : ''}`}
                                        onClick={() => setAiOpen(!aiOpen)}
                                        title="AI Assistant"
                                        style={{ color: aiOpen ? '#eab308' : 'inherit' }}
                                    >
                                        <Sparkles size={18} />
                                    </button>
                                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                    <TableBuilder onTableInsert={handleTableInsert} />
                                    <ImageUploader onImageInsert={handleImageInsert} />
                                    <button
                                        className={`spell-check-toggle ${spellCheckEnabled ? 'active' : ''}`}
                                        onClick={() => setSpellCheckEnabled(!spellCheckEnabled)}
                                        title={spellCheckEnabled ? 'Disable Spell Check' : 'Enable Spell Check'}
                                    >
                                        <CheckCheck size={18} />
                                    </button>
                                    <button
                                        className={`spell-check-toggle ${findReplaceOpen ? 'active' : ''}`}
                                        onClick={() => setFindReplaceOpen(prev => !prev)}
                                        title="Find & Replace (Ctrl+H)"
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Markdown Formatting Toolbar */}
                            <div className="format-toolbar">
                                {/* Undo / Redo */}
                                <button
                                    className="toolbar-btn"
                                    onClick={handleUndo}
                                    disabled={!canUndo}
                                    title="Undo (Ctrl+Z)"
                                >
                                    <Undo2 size={15} />
                                </button>
                                <button
                                    className="toolbar-btn"
                                    onClick={handleRedo}
                                    disabled={!canRedo}
                                    title="Redo (Ctrl+Y)"
                                >
                                    <Redo2 size={15} />
                                </button>

                                <span className="toolbar-divider" />

                                {/* Headings */}
                                <button className="toolbar-btn" onClick={() => insertLinePrefix('# ')} title="Heading 1">
                                    <Heading1 size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertLinePrefix('## ')} title="Heading 2">
                                    <Heading2 size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertLinePrefix('### ')} title="Heading 3">
                                    <Heading3 size={15} />
                                </button>

                                <span className="toolbar-divider" />

                                {/* Inline formatting */}
                                <button className="toolbar-btn" onClick={() => insertAtCursor('**', '**', 'bold')} title="Bold (Ctrl+B)">
                                    <Bold size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertAtCursor('*', '*', 'italic')} title="Italic (Ctrl+I)">
                                    <Italic size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertAtCursor('~~', '~~', 'text')} title="Strikethrough">
                                    <Strikethrough size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertAtCursor('`', '`', 'code')} title="Inline Code (Ctrl+E)">
                                    <Code size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertAtCursor('\n```\n', '\n```\n')} title="Code Block">
                                    <Code2 size={15} />
                                </button>

                                <span className="toolbar-divider" />

                                {/* Block elements */}
                                <button className="toolbar-btn" onClick={() => insertAtCursor('[', '](url)', 'link text')} title="Link (Ctrl+K)">
                                    <Link size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertLinePrefix('- ')} title="Unordered List">
                                    <List size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertLinePrefix('1. ')} title="Ordered List">
                                    <ListOrdered size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertLinePrefix('> ')} title="Blockquote">
                                    <Quote size={15} />
                                </button>
                                <button className="toolbar-btn" onClick={() => insertAtCursor('\n\n---\n\n')} title="Horizontal Rule">
                                    <Minus size={15} />
                                </button>

                                <span className="toolbar-spacer" />

                                <span className="keyboard-hints">Ctrl+B Bold • Ctrl+I Italic • Ctrl+H Find</span>
                            </div>

                            {/* Find & Replace Panel */}
                            {findReplaceOpen && (
                                <div className="find-replace-panel">
                                    <div className="find-replace-row">
                                        <input
                                            ref={findInputRef}
                                            className="find-replace-input"
                                            placeholder="Find…"
                                            value={findText}
                                            onChange={e => setFindText(e.target.value)}
                                        />
                                        <input
                                            className="find-replace-input"
                                            placeholder="Replace with…"
                                            value={replaceText}
                                            onChange={e => setReplaceText(e.target.value)}
                                        />
                                        <button
                                            className="find-replace-btn"
                                            onClick={handleReplaceAll}
                                            disabled={!findText}
                                        >
                                            Replace All
                                        </button>
                                        {findText && (
                                            <span className="find-replace-count">
                                                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                                            </span>
                                        )}
                                        <button
                                            className="find-replace-close"
                                            onClick={() => setFindReplaceOpen(false)}
                                            title="Close"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <textarea
                                ref={textareaRef}
                                className="markdown-textarea"
                                value={markdownContent}
                                onChange={handleMarkdownChange}
                                onSelect={handleSelect}
                                onKeyDown={handleKeyDown}
                                placeholder="Type markdown here…"
                                spellCheck={spellCheckEnabled}
                            />
                        </div>
                    )}

                    {/* Split View Divider */}
                    {viewMode === 'split' && <div className="split-divider" />}

                    {/* HTML Preview Pane */}
                    {showPreview && (
                        <div className={`preview-pane ${viewMode === 'split' ? 'split' : ''}`}>
                            <div className="markdown-header">
                                <span>👁️ Preview</span>
                            </div>
                            <div
                                className="markdown-preview"
                                dangerouslySetInnerHTML={{ __html: renderedHTML }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <AIAssistant
                isOpen={aiOpen}
                onClose={() => setAiOpen(false)}
                onInsert={replaceSelection}
                onReplace={replaceSelection}
                selectedText={selectedText}
                fullContent={markdownContent}
            />
        </div>
    );
};

/**
 * Default markdown content shown on first load
 */
function getDefaultContent() {
    return `# Welcome to MakeMe

Start editing your README.md here.

- [x] Initialize Project
- [ ] Build Amazing Features

## Code Example
\`\`\`javascript
console.log("Hello World");
\`\`\`

---

Made with ❤️ by [Heshan Jayakody](https://github.com/hheshanj)
`;
}

export default EditorWrapper;

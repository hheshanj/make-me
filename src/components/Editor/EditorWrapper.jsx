import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { CheckCheck } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import TableBuilder from './TableBuilder';
import ImageUploader from './ImageUploader';
import './EditorWrapper.css';

/**
 * EditorWrapper Component
 * 
 * A GitHub-style markdown editor with three view modes:
 * - Edit: Raw markdown editing
 * - Preview: Rendered HTML preview
 * - Split: Side-by-side edit and preview
 * 
 * Features:
 * - Full HTML support (preserves all attributes)
 * - GitHub Flavored Markdown (GFM)
 * - Real-time preview rendering
 * - Auto-save integration via onMarkdownChange callback
 * - Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
 */

// Configure marked to match GitHub's markdown rendering
marked.setOptions({
    breaks: true,          // Convert \n to <br>
    gfm: true,            // GitHub Flavored Markdown
    headerIds: true,      // Add IDs to headings
    mangle: false,        // Don't escape email addresses
    sanitize: false,      // Allow HTML tags (needed for README customization)
});

const EditorWrapper = ({ viewMode = 'editor', onMarkdownChange, initialContent }) => {
    // State management
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

    /**
     * Update rendered HTML whenever markdown content changes
     * Uses marked.js to parse markdown to HTML
     */
    useEffect(() => {
        try {
            const html = marked.parse(markdownContent);
            setRenderedHTML(html);
        } catch (error) {
            console.error('Markdown parsing error:', error);
            setRenderedHTML('<p style="color: red;">Error rendering markdown</p>');
        }
    }, [markdownContent]);

    /**
     * Notify parent component of content changes
     * This enables auto-save and other integrations
     */
    useEffect(() => {
        if (onMarkdownChange) {
            onMarkdownChange(markdownContent);
        }
    }, [markdownContent, onMarkdownChange]);

    /**
     * Track content changes for undo/redo
     * Debounced to avoid creating history entry for every keystroke
     */
    useEffect(() => {
        if (isUndoRedo) {
            setIsUndoRedo(false);
            return;
        }

        // Clear existing timer
        if (historyTimerRef.current) {
            clearTimeout(historyTimerRef.current);
        }

        // Set new timer to add to history after 500ms of no typing
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

        return () => {
            if (historyTimerRef.current) {
                clearTimeout(historyTimerRef.current);
            }
        };
    }, [markdownContent]);

    /**
     * Undo function
     */
    const handleUndo = () => {
        if (historyIndex > 0) {
            setIsUndoRedo(true);
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setMarkdownContent(history[newIndex]);
        }
    };

    /**
     * Redo function
     */
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setIsUndoRedo(true);
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setMarkdownContent(history[newIndex]);
        }
    };

    /**
     * Handle textarea input changes
     */
    const handleMarkdownChange = (e) => {
        setMarkdownContent(e.target.value);
    };

    /**
     * Insert text at cursor position or wrap selection
     */
    const insertAtCursor = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdownContent.substring(start, end);
        const beforeText = markdownContent.substring(0, start);
        const afterText = markdownContent.substring(end);

        const newText = beforeText + before + selectedText + after + afterText;
        setMarkdownContent(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    /**
     * Handle keyboard shortcuts
     */
    const handleKeyDown = (e) => {
        // Ctrl/Cmd + Z: Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            handleUndo();
        }
        // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
        else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            handleRedo();
        }
        // Ctrl/Cmd + B: Bold
        else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            insertAtCursor('**', '**');
        }
        // Ctrl/Cmd + I: Italic
        else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            insertAtCursor('*', '*');
        }
        // Ctrl/Cmd + K: Link
        else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            insertAtCursor('[', '](url)');
        }
        // Ctrl/Cmd + Shift + C: Code block
        else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            insertAtCursor('\n```\n', '\n```\n');
        }
        // Ctrl/Cmd + E: Inline code
        else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            insertAtCursor('`', '`');
        }
        // Ctrl/Cmd + Shift + X: Strikethrough
        else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
            e.preventDefault();
            insertAtCursor('~~', '~~');
        }
    };

    /**
     * Handle emoji insertion
     */
    const handleEmojiSelect = (emoji) => {
        insertAtCursor(emoji);
    };

    /**
     * Handle table insertion
     */
    const handleTableInsert = (table) => {
        insertAtCursor(table);
    };

    /**
     * Handle image insertion
     */
    const handleImageInsert = (markdown) => {
        insertAtCursor(markdown);
    };

    // Determine which panes to show based on view mode
    const showEditor = viewMode === 'editor' || viewMode === 'split';
    const showPreview = viewMode === 'preview' || viewMode === 'split';

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
                                    <span className="keyboard-hints">
                                        Ctrl+Z: Undo • Ctrl+Y: Redo • Ctrl+B: Bold
                                    </span>
                                </div>
                            </div>
                            <textarea
                                ref={textareaRef}
                                className="markdown-textarea"
                                value={markdownContent}
                                onChange={handleMarkdownChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Type markdown here..."
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

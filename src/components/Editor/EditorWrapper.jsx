import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
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
     * Handle textarea input changes
     */
    const handleMarkdownChange = (e) => {
        setMarkdownContent(e.target.value);
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
                            </div>
                            <textarea
                                className="markdown-textarea"
                                value={markdownContent}
                                onChange={handleMarkdownChange}
                                placeholder="Type markdown here..."
                                spellCheck="false"
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

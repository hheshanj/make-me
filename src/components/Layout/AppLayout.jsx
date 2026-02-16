import React, { useState } from 'react';
import { PanelRight, Layout, Moon, Sun, Download, Eye, FileCode, Copy, Maximize2, Type } from 'lucide-react';
import Button from '../UI/Button';
import ColorPicker from '../UI/ColorPicker';
import './AppLayout.css';

const AppLayout = ({ children, onToggleView, viewMode, onExport, onCopy, lastSaved, focusMode, onToggleFullscreen, wordCount, charCount, onReset, theme, onToggleTheme, font, onFontChange, accentColor, onAccentColorChange }) => {
    const [rightOpen, setRightOpen] = useState(true);

    return (
        <div className="app-layout">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <div className="app-logo-container">
                        <img src="/src/assets/makeme.png" alt="MakeMe" className="app-logo-img" />
                        <div className="app-logo">MakeMe</div>
                    </div>
                </div>

                <div className="header-center">
                    {lastSaved && (
                        <span className="saved-indicator">
                            ✓ Saved {new Date(lastSaved).toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <div className="header-right">
                    <div className="view-toggles">
                        <Button
                            variant={viewMode === 'editor' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onToggleView('editor')}
                            title="Editor View"
                        >
                            <Eye size={16} /> Editor
                        </Button>
                        <Button
                            variant={viewMode === 'split' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onToggleView('split')}
                            title="Split View"
                        >
                            <Layout size={16} /> Split
                        </Button>
                        <Button
                            variant={viewMode === 'markdown' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onToggleView('markdown')}
                            title="Raw Markdown"
                        >
                            <FileCode size={16} /> Code
                        </Button>
                    </div>

                    <div className="divider-vertical" />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onToggleFullscreen} title="Toggle Fullscreen (F11)">
                        <Maximize2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setRightOpen(!rightOpen)}>
                        <PanelRight size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onCopy} title="Copy to Clipboard">
                        <Copy size={16} />
                    </Button>
                    <Button variant="primary" size="sm" onClick={onExport}>
                        <Download size={16} /> Export
                    </Button>
                </div>
            </header>

            {/* Main Body */}
            <main className="app-body">
                {/* Center Content */}
                <section className="main-content">
                    {children}
                </section>

                {/* Right Sidebar */}
                <aside className={`sidebar sidebar-right ${rightOpen && !focusMode ? 'open' : 'closed'}`}>
                    <div className="sidebar-content">
                        <h3>Customization</h3>

                        {/* Font Selection */}
                        <div className="customization-section">
                            <div className="section-label">
                                <Type size={14} />
                                <span>Font Family</span>
                            </div>
                            <div className="font-selector">
                                <Button
                                    variant={font === 'sans-serif' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => onFontChange('sans-serif')}
                                >
                                    Sans
                                </Button>
                                <Button
                                    variant={font === 'serif' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => onFontChange('serif')}
                                >
                                    Serif
                                </Button>
                                <Button
                                    variant={font === 'mono' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => onFontChange('mono')}
                                >
                                    Mono
                                </Button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="customization-section">
                            <ColorPicker
                                currentColor={accentColor}
                                onChange={onAccentColorChange}
                            />
                        </div>
                    </div>
                </aside>
            </main>

            {/* Footer with Stats */}
            <footer className="app-footer">
                <div className="footer-stats">
                    <span className="footer-text">MakeMe - README Editor</span>
                    {wordCount > 0 && (
                        <>
                            <span className="footer-divider">•</span>
                            <span>{wordCount} words</span>
                            <span className="footer-divider">•</span>
                            <span>{charCount} characters</span>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default AppLayout;

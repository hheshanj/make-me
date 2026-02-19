import React, { useState } from 'react';
import { PanelRight, Layout, Moon, Sun, Download, Eye, FileCode, Copy, Maximize2, Type } from 'lucide-react';
import Button from '../UI/Button';
import ColorPicker from '../UI/ColorPicker';
import makeMeLogo from '../../assets/makeme.png';
import './AppLayout.css';

const AppLayout = ({ children, onToggleView, viewMode, onExport, onCopy, lastSaved, focusMode, onToggleFullscreen, wordCount, charCount, readingTime, onReset, theme, onToggleTheme, font, onFontChange, accentColor, onAccentColorChange }) => {
    const [rightOpen, setRightOpen] = useState(true);

    return (
        <div className="app-layout">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <div className="app-logo-container">
                        <img src={makeMeLogo} alt="MakeMe" className="app-logo-img" />
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
                            <Eye size={20} /> Edit
                        </Button>
                        <Button
                            variant={viewMode === 'split' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onToggleView('split')}
                            title="Split View"
                        >
                            <Layout size={20} /> Split
                        </Button>
                        <Button
                            variant={viewMode === 'preview' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onToggleView('preview')}
                            title="Preview"
                        >
                            <FileCode size={20} /> Preview
                        </Button>
                    </div>

                    <div className="divider-vertical" />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                    >
                        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onToggleFullscreen} title="Toggle Fullscreen (F11)">
                        <Maximize2 size={22} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setRightOpen(!rightOpen)}>
                        <PanelRight size={22} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onCopy} title="Copy to Clipboard">
                        <Copy size={20} />
                    </Button>
                    <Button variant="primary" size="sm" onClick={onExport}>
                        <Download size={20} /> Export
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

                        {/* Danger Zone */}
                        <div className="customization-section">
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={onReset}
                                style={{ width: '100%' }}
                            >
                                Clear All Content
                            </Button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Footer with Stats */}
            <footer className="app-footer">
                <div className="footer-stats">
                    <span className="footer-text">MakeMe - MARKDOWN Editor</span>
                    {wordCount > 0 && (
                        <>
                            <span className="footer-divider">•</span>
                            <span>{wordCount} words</span>
                            <span className="footer-divider">•</span>
                            <span>{charCount} characters</span>
                            <span className="footer-divider">•</span>
                            <span>~{readingTime} min read</span>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default AppLayout;

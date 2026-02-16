import React, { useState } from 'react';
import { PanelLeft, PanelRight, Layout, Moon, Sun, Download, Eye, FileCode, Copy } from 'lucide-react';
import Button from '../UI/Button';
import './AppLayout.css';

const AppLayout = ({ children, onToggleView, viewMode, onExport, onCopy }) => {
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);

    return (
        <div className="app-layout">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <div className="app-logo">MakeMe</div>
                    <Button variant="ghost" size="icon" onClick={() => setLeftOpen(!leftOpen)}>
                        <PanelLeft size={18} />
                    </Button>
                </div>

                <div className="header-center">
                    {/* Toolbar injected here or kept in Editor? Kept in editor for now */}
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
                {/* Left Sidebar */}
                <aside className={`sidebar sidebar-left ${leftOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-content">
                        <h3>Blocks</h3>
                        <p className="description">Drag & drop components</p>
                        {/* To be populated */}
                    </div>
                </aside>

                {/* Center Content */}
                <section className="main-content">
                    {children}
                </section>

                {/* Right Sidebar */}
                <aside className={`sidebar sidebar-right ${rightOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-content">
                        <h3>Properties</h3>
                        <div className="properties-panel">
                            <p className="description">Select an element to edit properties</p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default AppLayout;

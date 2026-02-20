import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Wand2, RefreshCw, FileText, Check, Copy, KeyRound } from 'lucide-react';
import { generateContent } from '../../utils/groq';
import './AIAssistant.css';

const AIAssistant = ({ isOpen, onClose, onInsert, onReplace, selectedText, fullContent }) => {
    const [apiKey, setApiKey] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState('generate'); // 'generate' or 'refine'

    useEffect(() => {
        const storedKey = localStorage.getItem('groq_api_key');
        if (storedKey) setApiKey(storedKey);
    }, []);

    useEffect(() => {
        if (selectedText) {
            setMode('refine');
            setPrompt('Improve this text');
        } else {
            setMode('generate');
        }
    }, [selectedText]);

    const handleSaveKey = (key) => {
        setApiKey(key);
        localStorage.setItem('groq_api_key', key);
    };

    const handleResetKey = () => {
        setApiKey('');
        localStorage.removeItem('groq_api_key');
        setError('');
    };

    const handleGenerate = async (customPrompt = null) => {
        if (!apiKey) {
            setError('Please enter your Groq API Key');
            return;
        }

        const promptToUse = customPrompt || prompt;
        if (!promptToUse) return;

        setIsLoading(true);
        setError('');
        setResult('');

        try {
            let fullPrompt = promptToUse;

            // If refining selection
            if (mode === 'refine' && selectedText) {
                fullPrompt = `Original Text:\n"${selectedText}"\n\nTask: ${promptToUse}`;
            }
            // If generating but with context (implicitly using full doc if no selection)
            else if (!selectedText && fullContent && (promptToUse.toLowerCase().includes('summarize') || promptToUse.toLowerCase().includes('expand'))) {
                fullPrompt = `Document Content:\n"${fullContent}"\n\nTask: ${promptToUse}`;
            }

            const generatedText = await generateContent(fullPrompt, apiKey);
            setResult(generatedText);
        } catch (err) {
            setError(err.message || 'Failed to generate content');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (actionPrompt) => {
        setPrompt(actionPrompt);
        handleGenerate(actionPrompt);
    };

    const handleInsert = () => {
        onInsert(result);
        onClose();
        setResult('');
    };

    const handleReplace = () => {
        onReplace(result);
        onClose();
        setResult('');
    };

    if (!isOpen) return null;

    return (
        <div className="ai-assistant-panel">
            <div className="ai-header">
                <div className="ai-title">
                    <Sparkles size={18} className="text-yellow-500" />
                    <span>Groq Assistant</span>
                </div>

                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                    {apiKey && (
                        <button
                            className="ai-close-btn"
                            onClick={handleResetKey}
                            title="Reset API Key"
                        >
                            <KeyRound size={16} />
                        </button>
                    )}
                    <button className="ai-close-btn" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="ai-content">
                {!apiKey ? (
                    <div className="ai-api-key-section">
                        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Enter Groq API Key</label>
                        <input
                            type="password"
                            className="ai-api-input"
                            placeholder="gsk_..."
                            onChange={(e) => handleSaveKey(e.target.value.trim())}
                        />
                        <p className="text-xs text-gray-500">Stored locally in your browser.</p>
                    </div>
                ) : (
                    <>
                        <div className="ai-mode-toggle">
                            <span className={`ai-mode-chip ${mode === 'generate' ? 'active-generate' : 'inactive'}`}>
                                Generate
                            </span>
                            <span className={`ai-mode-chip ${mode === 'refine' ? 'active-refine' : 'inactive'}`}>
                                Refine
                            </span>
                        </div>

                        {mode === 'refine' && selectedText && (
                            <div className="text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2 mb-2 line-clamp-2">
                                "{selectedText}"
                            </div>
                        )}

                        <div className="ai-input-wrapper">
                            <textarea
                                className="ai-input"
                                rows={3}
                                placeholder={mode === 'refine' ? "How should I change this text?" : "Describe what you want to write..."}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleGenerate();
                                    }
                                }}
                            />
                            <button
                                className="ai-send-btn"
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt}
                                title="Generate"
                            >
                                {isLoading ? <div className="spinner" /> : <Send size={16} />}
                            </button>
                        </div>

                        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}

                        {result && (
                            <div className="ai-result-section">
                                <span className="ai-result-label">Preview</span>
                                <div className="ai-result-box">
                                    {result}
                                </div>
                                <div className="ai-result-actions">
                                    <button
                                        className={`ai-main-action-btn ${mode === 'refine' ? 'replace' : ''}`}
                                        onClick={mode === 'refine' ? handleReplace : handleInsert}
                                    >
                                        <Check size={16} />
                                        {mode === 'refine' ? 'Replace' : 'Insert'}
                                    </button>
                                    <button
                                        className="ai-secondary-action-btn"
                                        onClick={() => navigator.clipboard.writeText(result)}
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {!result && (
                            <div className="ai-quick-chips">
                                <button className="ai-chip" onClick={() => handleQuickAction('Fix grammar and spelling')}>Grammar</button>
                                <button className="ai-chip" onClick={() => handleQuickAction('Make it more professional')}>Professional</button>
                                <button className="ai-chip" onClick={() => handleQuickAction('Summarize this content')}>Summarize</button>
                                <button className="ai-chip" onClick={() => handleQuickAction('Expand on this topic')}>Expand</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AIAssistant;

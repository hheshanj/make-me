import React, { useState } from 'react';
import { Sparkles, X, Loader2, Settings } from 'lucide-react';
import aiService from '../../utils/aiService';
import './AIAssistant.css';

/**
 * AIAssistant Component
 * 
 * Provides AI-powered suggestions and generation for README content
 */

const AI_FEATURES = [
    {
        id: 'generate',
        title: 'Generate README',
        description: 'Create a complete README from scratch',
        icon: '📝',
        requiresInput: true,
        inputPlaceholder: 'Describe your project (e.g., "A React app for task management")',
    },
    {
        id: 'improve',
        title: 'Improve Text',
        description: 'Make selected text more professional',
        icon: '✨',
        requiresSelection: true,
    },
    {
        id: 'installation',
        title: 'Add Installation',
        description: 'Generate installation instructions',
        icon: '📦',
    },
    {
        id: 'usage',
        title: 'Add Usage Examples',
        description: 'Generate usage examples and code snippets',
        icon: '💡',
    },
    {
        id: 'grammar',
        title: 'Fix Grammar',
        description: 'Fix spelling and grammar errors',
        icon: '✓',
        requiresSelection: true,
    },
    {
        id: 'custom',
        title: 'Custom Request',
        description: 'Ask AI anything about your README',
        icon: '🤖',
        requiresInput: true,
        inputPlaceholder: 'What would you like help with?',
    },
];

const AIAssistant = ({ isOpen, onClose, onInsert, currentContent, selectedText }) => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleFeatureClick = (feature) => {
        if (feature.requiresSelection && !selectedText) {
            setError('Please select some text first');
            return;
        }
        setActiveFeature(feature);
        setError('');
        setResult('');
        setUserInput('');
    };

    const handleGenerate = async () => {
        if (!aiService.isReady()) {
            setError('Please configure your API key first');
            setShowApiKeyInput(true);
            return;
        }

        setIsLoading(true);
        setError('');
        setResult('');

        try {
            let generatedText = '';

            switch (activeFeature.id) {
                case 'generate':
                    if (!userInput.trim()) {
                        setError('Please describe your project');
                        setIsLoading(false);
                        return;
                    }
                    generatedText = await aiService.generateReadme(userInput);
                    break;

                case 'improve':
                    generatedText = await aiService.improveText(selectedText || currentContent);
                    break;

                case 'installation':
                    generatedText = await aiService.generateInstallation(currentContent);
                    break;

                case 'usage':
                    generatedText = await aiService.generateUsage(currentContent);
                    break;

                case 'grammar':
                    generatedText = await aiService.fixGrammar(selectedText || currentContent);
                    break;

                case 'custom':
                    if (!userInput.trim()) {
                        setError('Please enter your request');
                        setIsLoading(false);
                        return;
                    }
                    generatedText = await aiService.getCustomSuggestion(userInput, currentContent);
                    break;

                default:
                    setError('Unknown feature');
                    setIsLoading(false);
                    return;
            }

            setResult(generatedText);
        } catch (err) {
            setError(err.message || 'Failed to generate content. Please try again.');
            console.error('AI Generation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInsert = () => {
        if (result) {
            onInsert(result);
            handleClose();
        }
    };

    const handleClose = () => {
        setActiveFeature(null);
        setUserInput('');
        setError('');
        setResult('');
        setShowApiKeyInput(false);
        onClose();
    };

    const handleSaveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            aiService.configure(apiKey.trim());
            setShowApiKeyInput(false);
            setError('');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="ai-assistant-backdrop" onClick={handleClose} />
            <div className="ai-assistant-modal">
                <div className="ai-assistant-header">
                    <div className="ai-assistant-title">
                        <Sparkles size={20} />
                        <span>AI Assistant</span>
                    </div>
                    <div className="ai-assistant-header-actions">
                        <button
                            className="ai-assistant-settings-btn"
                            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                            title="API Settings"
                        >
                            <Settings size={18} />
                        </button>
                        <button className="ai-assistant-close" onClick={handleClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {showApiKeyInput && (
                    <div className="ai-api-key-section">
                        <p className="ai-api-key-help">
                            Get your free API key from{' '}
                            <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                                Google AI Studio
                            </a>
                        </p>
                        <div className="ai-api-key-input">
                            <input
                                type="password"
                                placeholder="Enter your Gemini API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <button onClick={handleSaveApiKey}>Save</button>
                        </div>
                    </div>
                )}

                <div className="ai-assistant-content">
                    {!activeFeature ? (
                        <div className="ai-features-grid">
                            {AI_FEATURES.map((feature) => (
                                <button
                                    key={feature.id}
                                    className="ai-feature-card"
                                    onClick={() => handleFeatureClick(feature)}
                                    disabled={feature.requiresSelection && !selectedText}
                                >
                                    <span className="ai-feature-icon">{feature.icon}</span>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="ai-generation-view">
                            <button
                                className="ai-back-btn"
                                onClick={() => {
                                    setActiveFeature(null);
                                    setResult('');
                                    setError('');
                                }}
                            >
                                ← Back
                            </button>

                            <div className="ai-feature-header">
                                <span className="ai-feature-icon-large">{activeFeature.icon}</span>
                                <div>
                                    <h2>{activeFeature.title}</h2>
                                    <p>{activeFeature.description}</p>
                                </div>
                            </div>

                            {activeFeature.requiresInput && (
                                <div className="ai-input-section">
                                    <textarea
                                        placeholder={activeFeature.inputPlaceholder}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="ai-error-message">
                                    {error}
                                </div>
                            )}

                            {result && (
                                <div className="ai-result-section">
                                    <h3>Generated Content:</h3>
                                    <div className="ai-result-preview">
                                        <pre>{result}</pre>
                                    </div>
                                </div>
                            )}

                            <div className="ai-actions">
                                {!result ? (
                                    <button
                                        className="ai-generate-btn"
                                        onClick={handleGenerate}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="ai-spinner" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={18} />
                                                Generate
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="ai-regenerate-btn"
                                            onClick={handleGenerate}
                                            disabled={isLoading}
                                        >
                                            Regenerate
                                        </button>
                                        <button
                                            className="ai-insert-btn"
                                            onClick={handleInsert}
                                        >
                                            Insert into Editor
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AIAssistant;

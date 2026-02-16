import React, { useState, useEffect } from 'react';
import AppLayout from './components/Layout/AppLayout';
import EditorWrapper from './components/Editor/EditorWrapper';
import Toast from './components/UI/Toast';
import storage from './utils/storage';
import './styles/light-theme.css';
import './styles/loading.css';

function App() {
  const [viewMode, setViewMode] = useState('editor'); // 'editor', 'split', 'markdown'
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [font, setFont] = useState('sans-serif');
  const [accentColor, setAccentColor] = useState('#3b82f6');

  // Load saved content on mount
  useEffect(() => {
    const savedContent = storage.loadContent();
    if (savedContent) {
      setMarkdownContent(savedContent);
      setLastSaved(storage.getLastSaveTime());
    }

    // Load preferences
    setTheme(storage.loadTheme());
    setFont(storage.loadFont());
    setAccentColor(storage.loadAccentColor());

    setIsLoaded(true);
  }, []);

  // Auto-save with debouncing (2 seconds after last change)
  useEffect(() => {
    if (!isLoaded) return; // Don't save before initial load
    if (!markdownContent) return; // Don't save empty content on initial load

    const timer = setTimeout(() => {
      const success = storage.saveContent(markdownContent);
      if (success) {
        setLastSaved(Date.now());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [markdownContent, isLoaded]);

  // Calculate word and character count
  useEffect(() => {
    const words = markdownContent.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = markdownContent.length;
    setWordCount(words);
    setCharCount(chars);
  }, [markdownContent]);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.saveTheme(theme);
  }, [theme]);

  // Apply font to editor
  useEffect(() => {
    document.documentElement.style.setProperty('--editor-font',
      font === 'serif' ? 'Georgia, serif' :
        font === 'mono' ? 'var(--font-mono)' :
          'var(--font-sans)'
    );
    storage.saveFont(font);
  }, [font]);

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', accentColor);
    storage.saveAccentColor(accentColor);
  }, [accentColor]);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleExport = () => {
    // Download as .md file
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('README.md downloaded!');
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      showToast('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy');
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      setMarkdownContent('');
      storage.clearAll();
      showToast('Canvas cleared!');
    }
  };

  if (!isLoaded) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <div className="app">
      <AppLayout
        viewMode={viewMode}
        onToggleView={setViewMode}
        onExport={handleExport}
        onCopy={handleCopyToClipboard}
        lastSaved={lastSaved}
        focusMode={focusMode}
        onToggleFullscreen={handleToggleFullscreen}
        wordCount={wordCount}
        charCount={charCount}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        font={font}
        onFontChange={setFont}
        accentColor={accentColor}
        onAccentColorChange={setAccentColor}
      >
        <EditorWrapper
          viewMode={viewMode}
          onMarkdownChange={setMarkdownContent}
          initialContent={markdownContent}
        />
      </AppLayout>
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

export default App;

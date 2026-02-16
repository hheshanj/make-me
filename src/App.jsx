import React, { useState } from 'react';
import AppLayout from './components/Layout/AppLayout';
import EditorWrapper from './components/Editor/EditorWrapper';
import Toast from './components/UI/Toast';

function App() {
  const [viewMode, setViewMode] = useState('editor'); // 'editor', 'split', 'markdown'
  const [markdownContent, setMarkdownContent] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  return (
    <div className="app">
      <AppLayout
        viewMode={viewMode}
        onToggleView={setViewMode}
        onExport={handleExport}
        onCopy={handleCopyToClipboard}
      >
        <EditorWrapper
          viewMode={viewMode}
          onMarkdownChange={setMarkdownContent}
        />
      </AppLayout>
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

export default App;

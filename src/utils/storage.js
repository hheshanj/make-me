/**
 * Storage utilities for MakeMe editor
 * Handles localStorage operations for auto-save and persistence
 */

const STORAGE_KEYS = {
    CONTENT: 'makeme-content',
    TIMESTAMP: 'makeme-timestamp',
    THEME: 'makeme-theme',
    FONT: 'makeme-font',
    ACCENT_COLOR: 'makeme-accent-color'
};

export const storage = {
    // Save markdown content
    saveContent: (content) => {
        try {
            localStorage.setItem(STORAGE_KEYS.CONTENT, content);
            localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
            return true;
        } catch (err) {
            console.error('Failed to save content:', err);
            return false;
        }
    },

    // Load markdown content
    loadContent: () => {
        try {
            return localStorage.getItem(STORAGE_KEYS.CONTENT) || '';
        } catch (err) {
            console.error('Failed to load content:', err);
            return '';
        }
    },

    // Get last save timestamp
    getLastSaveTime: () => {
        try {
            const timestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
            return timestamp ? parseInt(timestamp, 10) : null;
        } catch (err) {
            console.error('Failed to get timestamp:', err);
            return null;
        }
    },

    // Clear all saved data
    clearAll: () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (err) {
            console.error('Failed to clear storage:', err);
            return false;
        }
    },

    // Save theme preference
    saveTheme: (theme) => {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
            return true;
        } catch (err) {
            console.error('Failed to save theme:', err);
            return false;
        }
    },

    // Load theme preference
    loadTheme: () => {
        try {
            return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
        } catch (err) {
            console.error('Failed to load theme:', err);
            return 'dark';
        }
    },

    // Save font preference
    saveFont: (font) => {
        try {
            localStorage.setItem(STORAGE_KEYS.FONT, font);
            return true;
        } catch (err) {
            console.error('Failed to save font:', err);
            return false;
        }
    },

    // Load font preference
    loadFont: () => {
        try {
            return localStorage.getItem(STORAGE_KEYS.FONT) || 'sans-serif';
        } catch (err) {
            console.error('Failed to load font:', err);
            return 'sans-serif';
        }
    },

    // Save accent color
    saveAccentColor: (color) => {
        try {
            localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, color);
            return true;
        } catch (err) {
            console.error('Failed to save accent color:', err);
            return false;
        }
    },

    // Load accent color
    loadAccentColor: () => {
        try {
            return localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || '#3b82f6';
        } catch (err) {
            console.error('Failed to load accent color:', err);
            return '#3b82f6';
        }
    }
};

export default storage;

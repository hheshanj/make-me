# MakeMe - Codebase Structure

## Overview
MakeMe is a GitHub-style markdown editor for creating professional README files. The application uses a simple, clean architecture focused on markdown editing and HTML preview.

## Core Dependencies
- **React 19.2.0** - UI framework
- **marked 17.0.2** - Markdown parser (same library GitHub uses)
- **lucide-react** - Icon library
- **framer-motion** - Animations
- **Vite** - Build tool and dev server

## Architecture

### Component Structure
```
src/
├── components/
│   ├── Editor/
│   │   ├── EditorWrapper.jsx      # Main editor component
│   │   └── EditorWrapper.css      # Editor styles
│   ├── Layout/
│   │   ├── AppLayout.jsx          # App shell with header/sidebar
│   │   └── AppLayout.css
│   ├── Modals/
│   │   ├── ExportModal.jsx        # Export functionality
│   │   ├── VersionHistory.jsx     # Version history
│   │   └── TemplateSelector.jsx   # Template selection
│   └── UI/
│       ├── Button.jsx             # Reusable button component
│       ├── ColorPicker.jsx        # Color picker for theming
│       └── Toast.jsx              # Toast notifications
├── styles/
│   ├── variables.css              # CSS custom properties
│   ├── light-theme.css            # Light theme colors
│   └── loading.css                # Loading state styles
├── utils/
│   └── storage.js                 # LocalStorage utilities
├── templates/
│   └── templates.js               # README templates
├── App.jsx                        # Root component
└── main.jsx                       # Entry point
```

## Key Features

### 1. Editor (EditorWrapper.jsx)
- **Three view modes:**
  - Edit: Raw markdown editing
  - Preview: Rendered HTML preview
  - Split: Side-by-side view
- **Full HTML support** - Preserves all HTML attributes (align, width, height, etc.)
- **GitHub Flavored Markdown** - Uses `marked.js` for parsing
- **Real-time preview** - Updates as you type

### 2. State Management (App.jsx)
- View mode (edit/preview/split)
- Theme (light/dark)
- Font selection
- Accent color
- Auto-save to localStorage
- Version history

### 3. Storage (storage.js)
- Content persistence
- User preferences
- Version snapshots
- Last save timestamp

## How to Extend

### Adding New Features

#### 1. Add a Toolbar to the Editor
```javascript
// In EditorWrapper.jsx, add before the editor-workspace div:
<div className="editor-toolbar">
  <button onClick={handleBold}>Bold</button>
  <button onClick={handleItalic}>Italic</button>
</div>
```

#### 2. Add Syntax Highlighting to Raw Editor
```javascript
// Install: npm install highlight.js
// Import and apply to textarea or use a code editor component
```

#### 3. Add Export Formats
```javascript
// In ExportModal.jsx, add new format handlers:
const exportAsPDF = () => {
  // Use html2pdf or similar library
};
```

#### 4. Add Custom Markdown Extensions
```javascript
// Configure marked with custom renderer:
const renderer = new marked.Renderer();
renderer.heading = (text, level) => {
  // Custom heading rendering
};
marked.use({ renderer });
```

### Styling Guidelines
- Use CSS custom properties from `variables.css`
- Follow existing naming conventions (BEM-style)
- Dark theme is default, light theme overrides in `light-theme.css`

## Build & Deploy
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Future Enhancement Ideas
1. **Syntax highlighting** in raw editor (CodeMirror or Monaco)
2. **Live collaboration** (WebSocket + CRDT)
3. **Image upload** (drag & drop with cloud storage)
4. **Markdown shortcuts** (Ctrl+B for bold, etc.)
5. **Table editor** (visual table builder)
6. **Emoji picker**
7. **Spell checker**
8. **Export to PDF/HTML**


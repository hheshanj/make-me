import React from 'react';
import Button from '../UI/Button';
import templates from '../../templates/templates';
import './TemplateSelector.css';

const TemplateSelector = ({ onSelect, onClose }) => {
    const handleTemplateClick = (templateKey) => {
        onSelect(templates[templateKey].content);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content template-selector" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Choose a Template</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="template-grid">
                        {Object.entries(templates).map(([key, template]) => (
                            <div key={key} className="template-card" onClick={() => handleTemplateClick(key)}>
                                <h3>{template.name}</h3>
                                <p>{template.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelector;

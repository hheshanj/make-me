import React from 'react';
import { Palette } from 'lucide-react';
import './ColorPicker.css';

const ColorPicker = ({ currentColor, onChange }) => {
    const presetColors = [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Green', value: '#10b981' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Cyan', value: '#06b6d4' },
        { name: 'Indigo', value: '#6366f1' }
    ];

    return (
        <div className="color-picker">
            <div className="color-picker-label">
                <Palette size={14} />
                <span>Accent Color</span>
            </div>
            <div className="color-grid">
                {presetColors.map((color) => (
                    <button
                        key={color.value}
                        className={`color-swatch ${currentColor === color.value ? 'active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => onChange(color.value)}
                        title={color.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;

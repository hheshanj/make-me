import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import './EmojiPicker.css';

/**
 * EmojiPicker Component
 * 
 * A simple emoji picker with common emojis for README files
 */

const EMOJI_CATEGORIES = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩'],
    'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿'],
    'Objects': ['💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💾', '💿', '📀', '📱', '📲', '☎️', '📞', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌'],
    'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '⭐', '🌟', '💫', '✅', '❌', '⚠️', '🔥', '💯', '🎯', '🚀', '⚡'],
    'Flags': ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️'],
};

const EmojiPicker = ({ onEmojiSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Smileys');

    const handleEmojiClick = (emoji) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    };

    return (
        <div className="emoji-picker-container">
            <button
                className="emoji-picker-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Insert Emoji"
            >
                <Smile size={18} />
            </button>

            {isOpen && (
                <>
                    <div className="emoji-picker-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="emoji-picker-popup">
                        <div className="emoji-picker-header">
                            <span>Pick an emoji</span>
                        </div>

                        <div className="emoji-categories">
                            {Object.keys(EMOJI_CATEGORIES).map(category => (
                                <button
                                    key={category}
                                    className={`emoji-category-btn ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="emoji-grid">
                            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
                                <button
                                    key={index}
                                    className="emoji-btn"
                                    onClick={() => handleEmojiClick(emoji)}
                                    title={emoji}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmojiPicker;

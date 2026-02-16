import React, { useState, useRef } from 'react';
import { Image, Upload, X } from 'lucide-react';
import './ImageUploader.css';

/**
 * ImageUploader Component
 * 
 * Drag & drop image uploader with imgur integration
 * Falls back to base64 data URLs if upload fails
 */

const ImageUploader = ({ onImageInsert }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);

        try {
            // Try to upload to imgur (free, no API key needed for anonymous uploads)
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    'Authorization': 'Client-ID 546c25a59c58ad7', // Public anonymous client ID
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setImageUrl(data.data.link);
            } else {
                // Fallback to base64
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImageUrl(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.error('Upload error:', error);
            // Fallback to base64
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        } finally {
            setIsUploading(false);
        }
    };

    const handleInsert = () => {
        if (imageUrl) {
            onImageInsert(`![Image](${imageUrl})`);
            setImageUrl('');
            setIsOpen(false);
        }
    };

    const handleUrlInsert = () => {
        if (imageUrl) {
            handleInsert();
        }
    };

    return (
        <div className="image-uploader-container">
            <button
                className="image-uploader-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Insert Image"
            >
                <Image size={18} />
            </button>

            {isOpen && (
                <>
                    <div className="image-uploader-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="image-uploader-popup">
                        <div className="image-uploader-header">
                            <span>Insert Image</span>
                            <button
                                className="image-uploader-close"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="image-uploader-content">
                            {/* Drag & Drop Area */}
                            <div
                                className={`image-drop-zone ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={32} />
                                <p>Drag & drop an image or click to browse</p>
                                <span className="image-drop-hint">
                                    {isUploading ? 'Uploading...' : 'Supports JPG, PNG, GIF'}
                                </span>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />

                            <div className="image-uploader-divider">
                                <span>or</span>
                            </div>

                            {/* URL Input */}
                            <div className="image-url-input">
                                <input
                                    type="url"
                                    placeholder="Paste image URL"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUrlInsert()}
                                />
                            </div>

                            {/* Preview */}
                            {imageUrl && !isUploading && (
                                <div className="image-preview">
                                    <img src={imageUrl} alt="Preview" />
                                </div>
                            )}

                            <button
                                className="image-insert-btn"
                                onClick={handleInsert}
                                disabled={!imageUrl || isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Insert Image'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageUploader;

import React from 'react';
import './Toast.css';

const Toast = ({ message, visible }) => {
    if (!visible) return null;

    return (
        <div className="toast">
            <span>{message}</span>
        </div>
    );
};

export default Toast;

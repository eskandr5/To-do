import { useEffect } from "react";
import './confirm.css';
import React from 'react';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, todoTitle = "" }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Delete Todo</h3>
                    <button className="close-button" onClick={onCancel}>×</button>
                </div>
                
                <div className="modal-body">
                    <p className="warning-text">Are you sure you want to delete this todo?</p>
                    {todoTitle && (
                        <p className="todo-title">"{todoTitle}"</p>
                    )}
                    <p className="warning-note">This action cannot be undone.</p>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="cancel-button" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="delete-button" 
                        onClick={onConfirm}
                        autoFocus
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
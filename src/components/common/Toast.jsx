// components/common/Toast.jsx
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200',
    };

    const textColor = {
        success: 'text-green-800',
        error: 'text-red-800',
        warning: 'text-yellow-800',
        info: 'text-blue-800',
    };

    const iconColor = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500',
    };

    const Icon = type === 'success' ? FaCheckCircle : FaExclamationCircle;

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-up">
            <div className={`${bgColor[type]} ${textColor[type]} border rounded-lg shadow-lg max-w-md`}>
                <div className="flex items-center p-4">
                    <Icon className={`${iconColor[type]} mr-3 flex-shrink-0`} size={20} />
                    <div className="flex-1 mr-2">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onClose?.();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
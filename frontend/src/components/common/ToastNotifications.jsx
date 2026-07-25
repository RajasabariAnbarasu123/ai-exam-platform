import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotifications = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={3}
            className="toast-container"
        />
    );
};

// Generates a stable toast ID from the message so duplicate messages
// are collapsed into one notification instead of stacking.
const toastId = (message) =>
    String(message).toLowerCase().trim().replace(/\s+/g, '-').slice(0, 64);

export const showToast = {
    success: (message, options = {}) => {
        const id = options.toastId || toastId(message);
        if (toast.isActive(id)) return;
        toast.success(message, {
            toastId: id,
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },
    error: (message, options = {}) => {
        const id = options.toastId || toastId(message);
        if (toast.isActive(id)) return;
        toast.error(message, {
            toastId: id,
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },
    warning: (message, options = {}) => {
        const id = options.toastId || toastId(message);
        if (toast.isActive(id)) return;
        toast.warning(message, {
            toastId: id,
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },
    info: (message, options = {}) => {
        const id = options.toastId || toastId(message);
        if (toast.isActive(id)) return;
        toast.info(message, {
            toastId: id,
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });
    },
};

export default ToastNotifications;
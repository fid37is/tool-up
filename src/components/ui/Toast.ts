interface ToastProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
}

export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    // This is a simplified implementation
    // In a real application, you would use a toast library or a state management system
    console.log(`Toast: ${variant}`, { title, description });

    // Alert for demonstration
    if (typeof window !== 'undefined') {
        alert(`${title ? title + ': ' : ''}${description}`);
    }
};
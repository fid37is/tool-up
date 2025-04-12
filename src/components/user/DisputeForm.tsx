// src/components/user/DisputeForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { Dispute, DisputeReason } from '../../types/dispute';

interface DisputeFormProps {
    orderId?: string;
    productId?: string;
}

const DisputeForm: React.FC<DisputeFormProps> = ({ orderId, productId }) => {
    const navigate = useNavigate();
    const { currentUser: user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reason, setReason] = useState<DisputeReason>('defective');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in to submit a dispute');
            return;
        }

        if (!title.trim() || !description.trim()) {
            setError('Please fill out all required fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const newDispute: Omit<Dispute, 'id' | 'createdAt'> = {
                userId: user.uid,
                title,
                description,
                reason,
                status: 'pending',
                orderId: orderId || null,
                productId: productId || null,
            };

            // Add dispute to Firestore
            await addDoc(collection(db, 'disputes'), {
                ...newDispute,
                createdAt: serverTimestamp(),
            });

            setSuccess(true);

            // Reset form
            setTitle('');
            setDescription('');
            setReason('defective');

            // Redirect after a delay
            setTimeout(() => {
                navigate('/user/disputes');
            }, 2000);

        } catch (err) {
            console.error('Error submitting dispute:', err);
            setError('Failed to submit dispute. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Dispute submitted successfully!</p>
                <p className="text-sm">You will be redirected to your disputes page shortly.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Submit a Dispute</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-medium mb-1">
                        Dispute Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Brief title for your dispute"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="reason" className="block font-medium mb-1">
                        Reason for Dispute <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value as DisputeReason)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    >
                        <option value="defective">Defective Product</option>
                        <option value="damaged">Damaged During Shipping</option>
                        <option value="wrong_item">Wrong Item Received</option>
                        <option value="missing_item">Missing Item</option>
                        <option value="refund">Refund Issue</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block font-medium mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 h-32"
                        placeholder="Please provide detailed information about your dispute..."
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded-md mr-3 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Dispute'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DisputeForm;
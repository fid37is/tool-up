// src/pages/dispute.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DisputeForm from '../components/user/DisputeForm';

const DisputePage: React.FC = () => {
    // Get parameters from the URL if they exist
    const { orderId, productId } = useParams<{ orderId?: string; productId?: string }>();

    // Set document title using standard React way instead of a custom hook
    useEffect(() => {
        document.title = 'Submit a Dispute';

        // Reset the title when component unmounts (optional)
        return () => {
            document.title = 'Online Store'; // Or whatever your default title is
        };
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Submit a Dispute</h1>

                {orderId && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
                        <p>You are filing a dispute for order <span className="font-semibold">#{orderId}</span></p>
                    </div>
                )}

                <DisputeForm orderId={orderId} productId={productId} />
            </div>
        </div>
    );
};

export default DisputePage;
// src/types/dispute.ts
export type DisputeStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';
export type DisputeReason = 'defective' | 'damaged' | 'wrong_item' | 'missing_item' | 'refund' | 'other';

export interface Dispute {
    id: string;
    userId: string;
    title: string;
    description: string;
    reason: DisputeReason;
    status: DisputeStatus;
    orderId: string | null;
    productId: string | null;
    createdAt: any; // Firebase timestamp
    resolvedAt?: any; // Firebase timestamp (optional)
    adminNotes?: string; // Admin notes (optional)
    resolution?: string; // Resolution details (optional)
}


// Helper function to get human-readable status
export const getStatusLabel = (status: DisputeStatus): string => {
    const statusMap: Record<DisputeStatus, string> = {
        pending: 'Pending Review',
        in_review: 'In Review',
        resolved: 'Resolved',
        rejected: 'Rejected'
    };

    return statusMap[status] || 'Unknown';
};

// Helper function to get human-readable reason
export const getReasonLabel = (reason: DisputeReason): string => {
    const reasonMap: Record<DisputeReason, string> = {
        defective: 'Defective Product',
        damaged: 'Damaged During Shipping',
        wrong_item: 'Wrong Item Received',
        missing_item: 'Missing Item',
        refund: 'Refund Issue',
        other: 'Other Issue'
    };

    return reasonMap[reason] || 'Unknown';
};
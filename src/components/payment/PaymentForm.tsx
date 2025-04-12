// components/PaymentMethodsManager.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PaymentMethod {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault: boolean;
    type: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
}

interface PaymentMethodsManagerProps {
    userId: string;
}

const PaymentMethodsManager: React.FC<PaymentMethodsManagerProps> = ({ userId }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // New payment method form state
    const [newCardNumber, setNewCardNumber] = useState('');
    const [newCardHolder, setNewCardHolder] = useState('');
    const [newExpiryDate, setNewExpiryDate] = useState('');
    const [newCardType, setNewCardType] = useState<PaymentMethod['type']>('visa');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const paymentMethodsRef = collection(db, 'paymentMethods');
            const q = query(paymentMethodsRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            const methods: PaymentMethod[] = [];
            querySnapshot.forEach((doc) => {
                methods.push({
                    id: doc.id,
                    ...doc.data() as Omit<PaymentMethod, 'id'>
                });
            });

            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCardTypeFromNumber = (cardNumber: string): PaymentMethod['type'] => {
        // Basic card type detection based on first digits
        if (cardNumber.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
        if (/^3[47]/.test(cardNumber)) return 'amex';
        if (/^6(?:011|5)/.test(cardNumber)) return 'discover';
        return 'other';
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setNewCardNumber(value);
        if (value.length >= 4) {
            setNewCardType(getCardTypeFromNumber(value));
        }
    };

    const formatCardNumber = (number: string) => {
        // Show only last 4 digits for display
        return `•••• •••• •••• ${number.slice(-4)}`;
    };

    const addPaymentMethod = async () => {
        if (!newCardNumber || !newCardHolder || !newExpiryDate) {
            return; // Form validation would go here
        }

        try {
            setIsSaving(true);

            // In a real app, you would use a payment processor API here
            // This is just for demonstration
            await addDoc(collection(db, 'paymentMethods'), {
                userId,
                cardNumber: newCardNumber,
                cardHolder: newCardHolder,
                expiryDate: newExpiryDate,
                type: newCardType,
                isDefault: paymentMethods.length === 0, // First card is default
                createdAt: new Date().toISOString()
            });

            // Reset form
            setNewCardNumber('');
            setNewCardHolder('');
            setNewExpiryDate('');
            setShowAddForm(false);

            // Refresh list
            await fetchPaymentMethods();
        } catch (error) {
            console.error('Error adding payment method:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const removePaymentMethod = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'paymentMethods', id));
            await fetchPaymentMethods();
        } catch (error) {
            console.error('Error removing payment method:', error);
        }
    };

    const setDefaultPaymentMethod = async (id: string) => {
        // Implementation would update all cards to non-default 
        // and then set the selected one to default
        // For demo purposes, we're just updating the UI
        setPaymentMethods(methods =>
            methods.map(method => ({
                ...method,
                isDefault: method.id === id
            }))
        );
    };

    if (loading) {
        return <div className="py-4 text-center">Loading payment methods...</div>;
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                {!showAddForm && (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        variant="outline"
                        size="sm"
                    >
                        Add New Card
                    </Button>
                )}
            </div>

            {paymentMethods.length === 0 && !showAddForm ? (
                <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No payment methods found</p>
                    <Button onClick={() => setShowAddForm(true)}>Add Payment Method</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`border rounded-lg p-4 ${method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{method.type.toUpperCase()}</span>
                                        {method.isDefault && (
                                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p>{formatCardNumber(method.cardNumber)}</p>
                                    <p className="text-sm text-gray-500">
                                        {method.cardHolder} • Expires {method.expiryDate}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    {!method.isDefault && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setDefaultPaymentMethod(method.id)}
                                        >
                                            Set Default
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removePaymentMethod(method.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showAddForm && (
                        <div className="border rounded-lg p-4 mt-4">
                            <h3 className="font-medium mb-3">Add New Payment Method</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Card Number</label>
                                    <Input
                                        value={newCardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="Card number"
                                        maxLength={16}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                                    <Input
                                        value={newCardHolder}
                                        onChange={(e) => setNewCardHolder(e.target.value)}
                                        placeholder="Name on card"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                    <Input
                                        value={newExpiryDate}
                                        onChange={(e) => setNewExpiryDate(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={addPaymentMethod}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Add Card'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default PaymentMethodsManager;
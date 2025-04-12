import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { clearCart } from '../../store/slices/CartSlice';

interface ShippingInfo {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface PaymentInfo {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}

const CheckoutForm: React.FC = () => {
    const { items, total } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    };

    const validateShippingForm = () => {
        return (
            shippingInfo.fullName.trim() !== '' &&
            shippingInfo.address.trim() !== '' &&
            shippingInfo.city.trim() !== '' &&
            shippingInfo.state.trim() !== '' &&
            shippingInfo.zipCode.trim() !== '' &&
            shippingInfo.country.trim() !== ''
        );
    };

    const validatePaymentForm = () => {
        return (
            paymentInfo.cardNumber.replace(/\s/g, '').length === 16 &&
            paymentInfo.cardHolder.trim() !== '' &&
            paymentInfo.expiryDate.trim() !== '' &&
            paymentInfo.cvv.trim() !== '' &&
            paymentInfo.cvv.length >= 3
        );
    };

    const nextStep = () => {
        if (step === 'shipping' && validateShippingForm()) {
            setStep('payment');
        } else if (step === 'payment' && validatePaymentForm()) {
            setStep('review');
        }
    };

    const prevStep = () => {
        if (step === 'payment') {
            setStep('shipping');
        } else if (step === 'review') {
            setStep('payment');
        }
    };

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            // Here you would typically send the order to your backend
            // For now, we'll simulate a successful order with a timeout
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Process successful order
            dispatch(clearCart());
            navigate('/order-confirmation');
        } catch (error) {
            console.error('Error submitting order:', error);
            // Handle error state
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format credit card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        // eslint-disable-next-line no-mixed-operators
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {/* Checkout steps */}
            <div className="flex mb-8">
                <div className={`flex-1 text-center p-2 ${step === 'shipping' ? 'font-bold border-b-2 border-blue-600' : ''}`}>
                    Shipping
                </div>
                <div className={`flex-1 text-center p-2 ${step === 'payment' ? 'font-bold border-b-2 border-blue-600' : ''}`}>
                    Payment
                </div>
                <div className={`flex-1 text-center p-2 ${step === 'review' ? 'font-bold border-b-2 border-blue-600' : ''}`}>
                    Review
                </div>
            </div>

            {/* Shipping Form */}
            {step === 'shipping' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block mb-1">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={shippingInfo.fullName}
                                onChange={handleShippingChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block mb-1">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingInfo.address}
                                onChange={handleShippingChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block mb-1">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingInfo.city}
                                onChange={handleShippingChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block mb-1">State/Province</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={shippingInfo.state}
                                onChange={handleShippingChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="zipCode" className="block mb-1">ZIP/Postal Code</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={shippingInfo.zipCode}
                                onChange={handleShippingChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block mb-1">Country</label>
                            <select
                                id="country"
                                name="country"
                                value={shippingInfo.country}
                                onChange={handleShippingChange}
                                className="w-full p-2 border rounded-md"
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="USA">United States</option>
                                <option value="CAN">Canada</option>
                                <option value="UK">United Kingdom</option>
                                <option value="AUS">Australia</option>
                                {/* Add more countries as needed */}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={nextStep}
                            disabled={!validateShippingForm()}
                            className={`bg-blue-600 text-white px-6 py-2 rounded ${!validateShippingForm() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            Continue to Payment
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="cardNumber" className="block mb-1">Card Number</label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value);
                                    setPaymentInfo((prev) => ({ ...prev, cardNumber: formatted }));
                                }}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="cardHolder" className="block mb-1">Card Holder</label>
                            <input
                                type="text"
                                id="cardHolder"
                                name="cardHolder"
                                value={paymentInfo.cardHolder}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="expiryDate" className="block mb-1">Expiry Date (MM/YY)</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handlePaymentChange}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cvv" className="block mb-1">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handlePaymentChange}
                                placeholder="123"
                                maxLength={4}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={prevStep}
                            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!validatePaymentForm()}
                            className={`bg-blue-600 text-white px-6 py-2 rounded ${!validatePaymentForm() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            Review Order
                        </button>
                    </div>
                </div>
            )}

            {/* Order Review */}
            {step === 'review' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Order Review</h2>

                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Items</h3>
                        <div className="border rounded-md overflow-hidden">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between p-3 border-b last:border-b-0">
                                    <div className="flex items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div>
                            <h3 className="font-medium mb-2">Shipping Address</h3>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p>{shippingInfo.fullName}</p>
                                <p>{shippingInfo.address}</p>
                                <p>
                                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                                </p>
                                <p>{shippingInfo.country}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Payment Method</h3>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p>Card: **** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                                <p>Card Holder: {paymentInfo.cardHolder}</p>
                                <p>Expires: {paymentInfo.expiryDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                            <p>Subtotal</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Shipping</p>
                            <p>$5.99</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Tax</p>
                            <p>${(total * 0.08).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                            <p>Total</p>
                            <p>${(total + 5.99 + total * 0.08).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={prevStep}
                            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmitOrder}
                            disabled={isSubmitting}
                            className={`bg-green-600 text-white px-8 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                        >
                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutForm;

import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';
import { PaymentMethod } from '../../types/user';

// Types for Stripe Integration
interface StripePaymentMethod {
    id: string;
    card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
}

interface CreatePaymentMethodData {
    userId: string;
    paymentMethodId: string;
}

interface CreatePaymentIntentData {
    amount: number;
    currency: string;
    paymentMethodId: string;
    customerId: string;
    description?: string;
    metadata?: Record<string, string>;
}

class StripeService {
    // Create a Stripe customer for user
    async createCustomer(userId: string, email: string, name?: string) {
        try {
            const createStripeCustomer = httpsCallable(functions, 'createStripeCustomer');
            const result = await createStripeCustomer({ userId, email, name });
            return result.data;
        } catch (error) {
            console.error('Error creating Stripe customer:', error);
            throw error;
        }
    }

    // Create a Setup Intent for adding payment method
    async createSetupIntent(customerId: string) {
        try {
            const createSetupIntent = httpsCallable(functions, 'createSetupIntent');
            const result = await createSetupIntent({ customerId });
            return result.data as { clientSecret: string };
        } catch (error) {
            console.error('Error creating Setup Intent:', error);
            throw error;
        }
    }

    // Add a payment method to a customer
    async attachPaymentMethod(userId: string, paymentMethodId: string) {
        try {
            const attachPaymentMethodToCustomer = httpsCallable(functions, 'attachPaymentMethodToCustomer');
            const result = await attachPaymentMethodToCustomer({ userId, paymentMethodId });
            return result.data;
        } catch (error) {
            console.error('Error attaching payment method:', error);
            throw error;
        }
    }

    // Create a payment intent for a purchase
    async createPaymentIntent(data: CreatePaymentIntentData) {
        try {
            const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
            const result = await createPaymentIntent(data);
            return result.data as { clientSecret: string };
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    // Get customer's payment methods
    async getPaymentMethods(customerId: string) {
        try {
            const getPaymentMethods = httpsCallable(functions, 'getCustomerPaymentMethods');
            const result = await getPaymentMethods({ customerId });
            const paymentMethods = (result.data as StripePaymentMethod[]).map(this.mapToAppPaymentMethod);
            return paymentMethods;
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    }

    // Delete a payment method
    async deletePaymentMethod(paymentMethodId: string) {
        try {
            const deletePaymentMethod = httpsCallable(functions, 'deletePaymentMethod');
            await deletePaymentMethod({ paymentMethodId });
            return true;
        } catch (error) {
            console.error('Error deleting payment method:', error);
            throw error;
        }
    }

    // Set default payment method
    async setDefaultPaymentMethod(customerId: string, paymentMethodId: string) {
        try {
            const setDefaultPaymentMethod = httpsCallable(functions, 'setDefaultPaymentMethod');
            await setDefaultPaymentMethod({ customerId, paymentMethodId });
            return true;
        } catch (error) {
            console.error('Error setting default payment method:', error);
            throw error;
        }
    }

    // Map Stripe payment method to app format
    private mapToAppPaymentMethod(stripeMethod: StripePaymentMethod): PaymentMethod {
        if (stripeMethod.card) {
            return {
                id: stripeMethod.id,
                type: 'card',
                isDefault: false, // This will be set separately
                last4: stripeMethod.card.last4,
                brand: stripeMethod.card.brand,
                expiryMonth: stripeMethod.card.exp_month,
                expiryYear: stripeMethod.card.exp_year
            };
        }

        // Handle other payment method types if needed
        return {
            id: stripeMethod.id,
            type: 'card',
            isDefault: false
        };
    }
}

export default new StripeService();
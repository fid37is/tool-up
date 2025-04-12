import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Address } from '../../types/user';

interface AddressFormProps {
    addresses: Address[];
    defaultAddressId: string | null;
    onUpdate: (addresses: Address[], defaultId: string | null) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
    addresses,
    defaultAddressId,
    onUpdate
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newAddress, setNewAddress] = useState<boolean>(false);
    const [formData, setFormData] = useState<Address>({
        id: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
    });

    const handleEditAddress = (index: number) => {
        setEditingIndex(index);
        setNewAddress(false);
        setFormData(addresses[index]);
    };

    const handleAddNewAddress = () => {
        setNewAddress(true);
        setEditingIndex(null);
        setFormData({
            id: `addr-${Date.now()}`,
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            isDefault: addresses.length === 0
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveAddress = () => {
        let updatedAddresses = [...addresses];
        let newDefaultId = defaultAddressId;

        if (newAddress) {
            updatedAddresses.push(formData);
            if (formData.isDefault) {
                newDefaultId = formData.id;
            }
        } else if (editingIndex !== null) {
            updatedAddresses[editingIndex] = formData;
            if (formData.isDefault) {
                newDefaultId = formData.id;
            }
        }

        onUpdate(updatedAddresses, newDefaultId);
        setNewAddress(false);
        setEditingIndex(null);
    };

    const handleDeleteAddress = (index: number) => {
        const addressToDelete = addresses[index];
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        let newDefaultId = defaultAddressId;

        if (addressToDelete.id === defaultAddressId && updatedAddresses.length > 0) {
            newDefaultId = updatedAddresses[0].id;
        } else if (updatedAddresses.length === 0) {
            newDefaultId = null;
        }

        onUpdate(updatedAddresses, newDefaultId);
    };

    const handleSetDefault = (id: string) => {
        onUpdate(addresses, id);
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Addresses</h2>
                <Button onClick={handleAddNewAddress}>Add New Address</Button>
            </div>

            {(editingIndex !== null || newAddress) ? (
                <div className="border p-4 rounded-md mb-6">
                    <h3 className="text-lg font-medium mb-4">
                        {newAddress ? 'Add New Address' : 'Edit Address'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="name">
                                Address Name (e.g. Home, Work)
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.id}
                                onChange={handleInputChange}
                                placeholder="Address Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="street">
                                Street Address
                            </label>
                            <Input
                                id="street"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                placeholder="Street Address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="city">
                                City
                            </label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="state">
                                State/Province
                            </label>
                            <Input
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State/Province"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
                                ZIP/Postal Code
                            </label>
                            <Input
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                placeholder="ZIP/Postal Code"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="country">
                            Country
                        </label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Country"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNewAddress(false);
                                setEditingIndex(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAddress}>Save Address</Button>
                    </div>
                </div>
            ) : null}

            <div className="space-y-4">
                {addresses.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        You haven't added any addresses yet.
                    </p>
                ) : (
                    addresses.map((address, index) => (
                        <div key={address.id} className="border p-4 rounded-md relative">
                            {address.id === defaultAddressId && (
                                <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                    Default
                                </span>
                            )}
                            <div className="mb-2">
                                <h3 className="font-medium">{address.id}</h3>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>{address.street}</p>
                                <p>
                                    {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p>{address.country}</p>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditAddress(index)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteAddress(index)}
                                >
                                    Delete
                                </Button>
                                {address.id !== defaultAddressId && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetDefault(address.id)}
                                    >
                                        Set as Default
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default AddressForm;
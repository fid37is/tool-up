import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Address, User } from '../types/user';
import AddressForm from '../components/user/AddressForm'
import PaymentMethodsManager from '../components/PaymentMethodsManager';
import NotificationSettings from '../components/NotificationSettings';
import { toast } from '../components/ui/Toast';

const UserSettings: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<User | null>(null);

    // Form states
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);

    const [notifications, setNotifications] = useState({
        emailOffers: false,
        emailOrderUpdates: true,
        emailDisputes: true,
        pushNotifications: true,
        smsUpdates: false
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = {
                        id: userDoc.id,
                        ...userDoc.data() as Omit<User, 'id'>
                    } as User;

                    setProfile(userData);
                    setDisplayName(userData.displayName || '');
                    setPhoneNumber(userData.phoneNumber || '');
                    setAddresses(userData.addresses || []);
                    setDefaultAddressId(userData.defaultAddressId || null);
                    setNotifications({
                        ...notifications,
                        ...userData.notificationPreferences
                    });
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast({
                    title: 'Error',
                    description: 'Could not load your profile. Please try again.',
                    variant: 'destructive'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser, notifications]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!currentUser) return;

        setSaving(true);
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);

            // Upload new photo if selected
            let photoURL = profile?.photoURL || null;
            if (photoFile) {
                const storageRef = ref(storage, `user-profiles/${currentUser.uid}`);
                await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(storageRef);

                // Update Firebase Auth profile
                await updateProfile(currentUser, {
                    displayName,
                    photoURL
                });
            } else if (displayName !== currentUser.displayName) {
                // Update display name in Auth if changed
                await updateProfile(currentUser, { displayName });
            }

            // Update Firestore document
            await updateDoc(userDocRef, {
                displayName,
                phoneNumber,
                photoURL,
                addresses,
                defaultAddressId,
                notificationPreferences: notifications,
                updatedAt: new Date().toISOString()
            });

            toast({
                title: 'Success',
                description: 'Your profile has been updated.',
            });

        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update your profile. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAddressUpdate = (updatedAddresses: Address[], newDefaultId: string | null) => {
        setAddresses(updatedAddresses);
        setDefaultAddressId(newDefaultId);
    };

    const handleNotificationUpdate = (key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading settings...</div>;
    }

    if (!currentUser) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">You need to be logged in to access settings</h2>
                <Button onClick={() => navigate('/login')}>Log In</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <Button onClick={() => navigate('/profile')}>Back to Profile</Button>
            </div>

            <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : profile?.photoURL ? (
                                        <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-500">
                                            {displayName?.[0] || currentUser.email?.[0] || 'U'}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Profile Photo</label>
                                    <input title='Upload profile photo'
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="displayName">
                                        Full Name
                                    </label>
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setDisplayName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        value={currentUser.email || ''}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        To change your email, visit the Security tab
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">
                                    Phone Number
                                </label>
                                <Input
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPhoneNumber(e.target.value)}
                                    placeholder="Your phone number"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="addresses">
                    <AddressForm
                        addresses={addresses}
                        defaultAddressId={defaultAddressId}
                        onUpdate={handleAddressUpdate}
                    />
                </TabsContent>

                <TabsContent value="payment">
                    <PaymentMethodsManager userId={currentUser.uid} />
                </TabsContent>

                <TabsContent value="notifications">
                    <NotificationSettings
                        preferences={notifications}
                        onUpdate={handleNotificationUpdate}
                        onSave={handleSaveProfile}
                        saving={saving}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserSettings;
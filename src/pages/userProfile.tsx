import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import OrderHistory from '../components/OrderHistory';
import DisputesList from '../components/DisputesList'; 
import { useNavigate } from 'react-router-dom';
import { User } from '../types/user';

const UserProfile: React.FC = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                    setProfile({
                        id: userDoc.id,
                        ...userDoc.data() as Omit<User, 'id'>
                    });
                } else {
                    console.log('No user profile found');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading profile...</div>;
    }

    if (!currentUser) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">You need to be logged in to view your profile</h2>
                <Button onClick={() => navigate('/login')}>Log In</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="p-6">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                {profile?.photoURL ? (
                                    <img
                                        src={profile.photoURL}
                                        alt="Profile"
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-500">
                                        {profile?.displayName?.[0] || currentUser.email?.[0] || 'U'}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-xl font-semibold">
                                {profile?.displayName || 'User'}
                            </h2>
                            <p className="text-gray-600 mb-4">{currentUser.email}</p>

                            <Button
                                variant="outline"
                                className="w-full mb-2"
                                onClick={() => navigate('/settings')}
                            >
                                Edit Profile
                            </Button>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <h3 className="font-medium mb-2">Account Info</h3>
                            <div className="text-sm">
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">Member since</span>
                                    <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">Phone</span>
                                    <span>{profile?.phoneNumber || 'Not provided'}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">Default address</span>
                                    <span className="text-right">
                                        {profile?.defaultAddressId ?
                                            `${profile.defaultAddressId.street.substring(0, 15)}...` :
                                            'Not provided'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
                        <OrderHistory userId={currentUser.uid} limit={5} />
                        <div className="mt-4 text-right">
                            <Button variant="link" onClick={() => navigate('/orders')}>
                                View All Orders
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Recent Disputes</h2>
                        <DisputesList userId={currentUser.uid} limit={3} />
                        <div className="mt-4 text-right">
                            <Button variant="link" onClick={() => navigate('/disputes')}>
                                View All Disputes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
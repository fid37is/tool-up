import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleGoogleRegister = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleFacebookRegister = async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 shadow rounded bg-white">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
            />
            <button type='button'
                onClick={handleEmailRegister}
                className="w-full bg-blue-600 text-white p-2 rounded mb-4"
            >
                Register with Email
            </button>

            <div className="flex flex-col gap-2">
                <button
                    onClick={handleGoogleRegister}
                    className="w-full bg-red-500 text-white p-2 rounded"
                >
                    Sign Up with Google
                </button>
                <button
                    onClick={handleFacebookRegister}
                    className="w-full bg-blue-800 text-white p-2 rounded"
                >
                    Sign Up with Facebook
                </button>
            </div>
        </div>
    );
}

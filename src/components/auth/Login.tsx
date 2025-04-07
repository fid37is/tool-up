import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleFacebookLogin = async () => {
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
            <h2 className="text-2xl font-bold mb-4">Login to Your Account</h2>

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
                className="w-full mb-4 p-2 border rounded"
            />
            <button
                onClick={handleEmailLogin}
                className="w-full bg-blue-600 text-white p-2 rounded mb-4"
            >
                Login with Email
            </button>

            <div className="flex flex-col gap-2">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-500 text-white p-2 rounded"
                >
                    Login with Google
                </button>
                <button
                    onClick={handleFacebookLogin}
                    className="w-full bg-blue-800 text-white p-2 rounded"
                >
                    Login with Facebook
                </button>
            </div>
        </div>
    );
}

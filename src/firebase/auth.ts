import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const registerWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const loginWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

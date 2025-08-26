import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { app } from "./firebase-config.js";

export const auth = getAuth(app);

export async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
    return await signOut(auth);
}

import { auth, signup, login, logout } from "./auth.js";
import {
    getFirestore,
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    serverTimestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { app } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const db = getFirestore(app);

// DOM Elements
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const todoSection = document.getElementById("todoSection");
const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");

let unsubscribeTodos = null;

// Signup handler
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    try {
        await signup(email, password);
        signupForm.reset();
    } catch (err) {
        alert(err.message);
    }
});

// Login handler
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
        await login(email, password);
        loginForm.reset();
    } catch (err) {
        alert(err.message);
    }
});

// Logout handler
logoutBtn.addEventListener("click", async () => {
    await logout();
});

// Add todo handler (per-user subcollection)
addTodoBtn.addEventListener("click", async () => {
    const title = todoInput.value.trim();
    const user = auth.currentUser;
    if (title && user) {
        await addDoc(
            collection(db, "users", user.uid, "todos"),
            {
                title: title,
                completed: false,
                createdAt: serverTimestamp()
            }
        );
        todoInput.value = "";
    }
});

// Auth state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        todoSection.style.display = "block";
        logoutBtn.style.display = "inline-block";
        loginForm.style.display = "none";
        signupForm.style.display = "none";

        // Unsubscribe previous listener if any
        if (unsubscribeTodos) unsubscribeTodos();

        // Load user's todos in real-time from their subcollection
        const q = query(
            collection(db, "users", user.uid, "todos"),
            orderBy("createdAt")
        );

        unsubscribeTodos = onSnapshot(q, (snapshot) => {
            todoList.innerHTML = "";
            snapshot.forEach((doc) => {
                const data = doc.data();
                const li = document.createElement("li");
                li.textContent = data.title + (data.completed ? " ✅" : "");

                //completed button
                if (!data.completed) {
                    const completeBtn = document.createElement("button");
                    completeBtn.textContent = "Complete";
                    completeBtn.onclick = async () => {
                        await updateDoc(doc.ref, { completed: true });
                    };
                    li.appendChild(completeBtn);
                }
                todoList.appendChild(li);
            });
        });

    } else {
        todoSection.style.display = "none";
        logoutBtn.style.display = "none";
        loginForm.style.display = "block";
        signupForm.style.display = "block";
        if (unsubscribeTodos) unsubscribeTodos();
        todoList.innerHTML = "";
    }
});

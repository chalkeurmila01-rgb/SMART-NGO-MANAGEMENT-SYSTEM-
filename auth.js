import { auth, database } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";


// ===============================
// REGISTER USER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const errorBox = document.getElementById("registerError");

        errorBox.classList.add("hidden");
        errorBox.textContent = "";


        // Password validation
        if (password.length < 6) {
            errorBox.textContent =
                "Password must contain at least 6 characters.";

            errorBox.classList.remove("hidden");
            return;
        }


        // Confirm password
        if (password !== confirmPassword) {

            errorBox.textContent =
                "Passwords do not match.";

            errorBox.classList.remove("hidden");
            return;
        }


        try {

            // Create Firebase Authentication account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;


            // Save user information in Realtime Database
            await set(
                ref(database, "users/" + user.uid),
                {
                    fullName: fullName,
                    email: email,

                    // IMPORTANT:
                    // Every normal registration gets user role
                    role: "user",

                    contact: "",
                    status: "active",

                    createdAt: new Date().toISOString()
                }
            );


            alert("Registration successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(error);

            errorBox.textContent =
                getFirebaseErrorMessage(error.code);

            errorBox.classList.remove("hidden");
        }

    });

}



// ===============================
// LOGIN USER
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const errorBox =
            document.getElementById("loginError");

        errorBox.classList.add("hidden");
        errorBox.textContent = "";


        try {

            // Firebase Authentication
            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;


            // Get user's role from Realtime Database
            const userRef =
                ref(database, "users/" + user.uid);

            const snapshot = await get(userRef);


            if (!snapshot.exists()) {

                await signOut(auth);

                throw new Error(
                    "User profile not found."
                );
            }


            const userData = snapshot.val();

            const role = userData.role;


            // Role-based redirection
            if (role === "admin") {

                window.location.href = "admin.html";

            } else {

                window.location.href = "dashboard.html";
            }

        } catch (error) {

            console.error(error);

            errorBox.textContent =
                getFirebaseErrorMessage(error.code || error.message);

            errorBox.classList.remove("hidden");
        }

    });

}



// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            console.error("Logout error:", error);

        }

    });

}



// ===============================
// FIREBASE ERROR MESSAGES
// ===============================

function getFirebaseErrorMessage(errorCode) {

    switch (errorCode) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Password is too weak.";

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        default:
            return "Something went wrong. Please try again.";
    }
}
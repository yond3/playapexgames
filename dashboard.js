// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
    getAuth,
    onAuthStateChanged, // Monitors login status
    signOut         // Function for logging out
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc       // Function to retrieve a document
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Firebase Configuration ---
// (Should be the same config as in script.js)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key if hidden previously
  authDomain: "apexgames-a5903.firebaseapp.com",
  projectId: "apexgames-a5903",
  storageBucket: "apexgames-a5903.appspot.com",
  messagingSenderId: "927388647652",
  appId: "1:927388647652:web:f065997c4969510b056cf1",
  measurementId: "G-B5GKRLC8X7"
};

// --- Initialize Firebase ---
try {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app); // Initialize Analytics if needed on dashboard
    const auth = getAuth(app);
    const db = getFirestore(app);

    // --- Get Dashboard Elements ---
    // Header elements
    const headerUsername = document.getElementById('headerUsername');
    const headerUserValue = document.getElementById('headerUserValue'); // Assuming this shows Coins?
    const logoutBtn = document.getElementById('logoutBtn');

    // User card elements
    const cardUsername = document.getElementById('cardUsername');
    // Note: Ensure these IDs match your HTML or remove/comment out if not used
    const accIdElement = document.getElementById('accId');
    const matchInfoElement = document.getElementById('matchInfo');
    const coinInfoElement = document.getElementById('coinInfo');
    const lostInfoElement = document.getElementById('lostInfo');
    const coinstreakInfoElement = document.getElementById('coinstreakInfo'); // Check ID casing in HTML
    const userAvatarImage = document.querySelector('.user-avatar img'); // Check class in HTML

    // Leaderboard elements
    const leaderboardTabsContainer = document.querySelector('.leaderboard-tabs');

    // Game Card elements (Make sure '.play-now-btn' exists in your dashboard.html)
    const playNowButton = document.querySelector('.play-now-btn');


    // --- Function to Fetch and Display User Profile ---
    async function loadUserProfile(uid) {
        if (!uid) { console.error("No UID provided to loadUserProfile"); return; }
        console.log(`Loading profile for UID: ${uid}`);
        const userDocRef = doc(db, "users", uid);

        try {
            const docSnap = await getDoc(userDocRef);
            let username = 'User'; // Default
            let coins = 0; // Default
            // Fetch other data needed for display
            let matchesPlayed = 'N/A';
            let wins = 'N/A'; // Make sure 'wins' exists in HTML if needed
            let lost = 'N/A';
            let winstreak = 'N/A'; // Make sure 'WinstreakInfo' ID exists and matches casing

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log("User data from Firestore:", userData);
                // Assign data - ensure Firestore field names match (e.g., userData.username)
                username = userData.username || username;
                coins = userData.coins || coins;
                matchesPlayed = userData.matchesPlayed || matchesPlayed;
                wins = userData.wins || wins; // Assign if 'wins' field exists
                lost = userData.matchesLost || lost;
                winstreak = userData.winStreak || winstreak; // Check casing (winStreak vs coinStreak)

                // Update User Card elements that exist in your HTML
                if (cardUsername) cardUsername.textContent = username;
                // Update based on confirmed HTML IDs from previous context
                if (matchInfoElement) matchInfoElement.textContent = matchesPlayed;
                if (document.getElementById('winsInfo')) document.getElementById('winsInfo').textContent = wins; // Check HTML ID
                if (lostInfoElement) lostInfoElement.textContent = lost;
                if (document.getElementById('WinstreakInfo')) document.getElementById('WinstreakInfo').textContent = winstreak; // Check HTML ID

                // Update other elements if they exist and you need them
                // if (accIdElement) accIdElement.textContent = uid.substring(0, 8).toUpperCase() || 'N/A';
                // if (coinInfoElement) coinInfoElement.textContent = coins;
                // if (userAvatarImage && userData.avatarUrl) userAvatarImage.src = userData.avatarUrl;

            } else {
                console.warn(`No profile document found for UID: ${uid}. Displaying defaults.`);
                 if (cardUsername) cardUsername.textContent = username;
                 // Display defaults for other fields
                 if (matchInfoElement) matchInfoElement.textContent = matchesPlayed;
                 if (document.getElementById('winsInfo')) document.getElementById('winsInfo').textContent = wins;
                 if (lostInfoElement) lostInfoElement.textContent = lost;
                 if (document.getElementById('WinstreakInfo')) document.getElementById('WinstreakInfo').textContent = winstreak;
            }

             // Update Header (common to dashboard)
            if (headerUsername) headerUsername.textContent = username;
            if (headerUserValue) headerUserValue.textContent = coins; // Displaying coins in the header

        } catch (error) {
            console.error("Error fetching user profile from Firestore:", error);
            if (headerUsername) headerUsername.textContent = 'Error';
            if (cardUsername) cardUsername.textContent = 'Error';
            // Handle error display for other elements
             if (matchInfoElement) matchInfoElement.textContent = 'Error';
             if (document.getElementById('winsInfo')) document.getElementById('winsInfo').textContent = 'Error';
             if (lostInfoElement) lostInfoElement.textContent = 'Error';
             if (document.getElementById('WinstreakInfo')) document.getElementById('WinstreakInfo').textContent = 'Error';
        }
    }

    // --- Logout Function ---
    function handleLogout() {
        signOut(auth).then(() => {
            console.log("User signed out successfully.");
            // Redirect will now ONLY happen via onAuthStateChanged if needed after sign out action
        }).catch((error) => {
            console.error("Sign out error:", error);
            alert("Error signing out. Please try again.");
        });
    }

    // --- Authentication State Observer (for Dashboard Page) --- // *** MODIFIED ***
    onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed on dashboard.js'); // Simplified log
        if (user) {
            // User is signed in, load their profile
            console.log("Dashboard: User is logged in:", user.uid);
            loadUserProfile(user.uid);

            // Setup logout button listener
            if (logoutBtn) {
                 logoutBtn.removeEventListener('click', handleLogout); // Prevent duplicates
                 logoutBtn.addEventListener('click', handleLogout);
            } else {
                 console.warn("Logout button (#logoutBtn) not found on dashboard.");
            }

        } else {
            // User is signed out.
            console.warn("Dashboard: User detected as logged out on dashboard page.");

            // *** REDIRECT IS REMOVED / COMMENTED OUT ***
            // We no longer force redirect from here, assuming the user intentionally logged out elsewhere
            // or is navigating away. The target page should handle its own auth check.

            // window.location.replace('/index.html'); // <--- No longer redirecting here automatically

            // Optionally, you could disable dashboard elements here if the user *somehow*
            // ends up on the dashboard while logged out without a redirect.
            if (headerUsername) headerUsername.textContent = 'Logged Out';
            if (cardUsername) cardUsername.textContent = 'Logged Out';
            // Consider disabling buttons, clearing data, etc.
        }
    });

    // --- Optional: Leaderboard Tab Logic ---
    if (leaderboardTabsContainer) { // Only add if tabs exist
        const leaderboardTabs = leaderboardTabsContainer.querySelectorAll('.tab-btn');
        leaderboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                leaderboardTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                console.log(`Switched to leaderboard tab: ${tab.textContent}`);
                // TODO: Add logic here to load corresponding leaderboard data
            });
        });
         // Activate the first tab by default if needed
        if (leaderboardTabs.length > 0) {
             leaderboardTabs[0].classList.add('active');
        }
    }

    // --- Add Event Listener for Play Now Button --- // *** ADDED / KEPT SIMPLE ***
    if (playNowButton) {
        playNowButton.addEventListener('click', () => {
            console.log("Play Now button clicked. Navigating to Bug Hunter game...");
            // Make sure 'bug_hunter.html' is the correct path/filename for your game
            window.location.href = 'bug_hunter.html';
        });
    } else {
        // Make sure your HTML actually has a button with class="play-now-btn"
        console.warn("Play Now button (.play-now-btn) not found.");
    }
    // --- End of Play Now Button Logic ---


} catch (error) {
    console.error("Error initializing Firebase or dashboard script:", error);
    alert("Error loading dashboard. Please try refreshing.");
    // Redirect if Firebase fails? Maybe redirect only on specific critical errors.
    // window.location.replace('/index.html');
}
